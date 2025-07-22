"""
History Manager for Smart Email Guardian
Handles scan history storage in JSON files instead of database
"""

import json
import os
import datetime
import hashlib
from typing import List, Dict, Optional
from pathlib import Path

class HistoryManager:
    def __init__(self, history_dir: str = "history"):
        self.history_dir = Path(history_dir)
        self.history_dir.mkdir(exist_ok=True)
        
        self.scans_file = self.history_dir / "scan_history.json"
        self.stats_file = self.history_dir / "statistics.json"
        self.daily_logs_dir = self.history_dir / "daily_logs"
        self.daily_logs_dir.mkdir(exist_ok=True)
        
        self._init_files()
    
    def _init_files(self):
        """Initialize history files if they don't exist"""
        if not self.scans_file.exists():
            self._write_json(self.scans_file, {"scans": [], "total_count": 0})
        
        if not self.stats_file.exists():
            self._write_json(self.stats_file, {
                "total_scans": 0,
                "classification_breakdown": {},
                "daily_stats": {},
                "last_updated": datetime.datetime.now().isoformat()
            })
    
    def _read_json(self, file_path: Path) -> dict:
        """Safely read JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def _write_json(self, file_path: Path, data: dict):
        """Safely write JSON file"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        except Exception as e:
            print(f"Error writing to {file_path}: {e}")
    
    def _get_email_hash(self, email_text: str) -> str:
        """Generate hash for email to detect duplicates"""
        return hashlib.md5(email_text.encode('utf-8')).hexdigest()[:12]
    
    def add_scan_result(self, email_text: str, result: Dict, processing_time: int = 0) -> bool:
        """Add new scan result to history"""
        try:
            history_data = self._read_json(self.scans_file)
            if not history_data:
                history_data = {"scans": [], "total_count": 0}
            
            scan_entry = {
                "id": len(history_data["scans"]) + 1,
                "timestamp": datetime.datetime.now().isoformat(),
                "date": datetime.date.today().isoformat(),
                "email_hash": self._get_email_hash(email_text),
                "email_text": email_text[:1000],  
                "email_length": len(email_text),
                "spam_prediction": result.get('spam_prediction', 'unknown'),
                "spam_confidence": result.get('spam_confidence', 0.0),
                "phishing_prediction": result.get('phishing_prediction', 'unknown'),
                "phishing_confidence": result.get('phishing_confidence', 0.0),
                "final_classification": result.get('final_classification', 'unknown'),
                "explanation": result.get('explanation', ''),
                "processing_time_ms": processing_time
            }
            
            history_data["scans"].append(scan_entry)
            history_data["total_count"] = len(history_data["scans"])
            
            if len(history_data["scans"]) > 1000:
                history_data["scans"] = history_data["scans"][-1000:]
                history_data["total_count"] = 1000
            
            self._write_json(self.scans_file, history_data)
            
            self._update_statistics(scan_entry)
            
            self._save_daily_log(scan_entry)
            
            return True
            
        except Exception as e:
            print(f"Error adding scan result: {e}")
            return False
    
    def _update_statistics(self, scan_entry: Dict):
        """Update overall statistics"""
        try:
            stats = self._read_json(self.stats_file)
            if not stats:
                stats = {
                    "total_scans": 0,
                    "classification_breakdown": {},
                    "daily_stats": {},
                    "confidence_stats": {"high": 0, "medium": 0, "low": 0}
                }
            
            stats["total_scans"] = stats.get("total_scans", 0) + 1
            
            classification = scan_entry["final_classification"]
            if "classification_breakdown" not in stats:
                stats["classification_breakdown"] = {}
            stats["classification_breakdown"][classification] = stats["classification_breakdown"].get(classification, 0) + 1
            
            date = scan_entry["date"]
            if "daily_stats" not in stats:
                stats["daily_stats"] = {}
            if date not in stats["daily_stats"]:
                stats["daily_stats"][date] = {"total": 0, "spam": 0, "phishing": 0, "legitimate": 0}
            
            stats["daily_stats"][date]["total"] += 1
            stats["daily_stats"][date][classification] = stats["daily_stats"][date].get(classification, 0) + 1
            
            max_confidence = max(scan_entry["spam_confidence"], scan_entry["phishing_confidence"])
            if max_confidence >= 0.8:
                stats["confidence_stats"]["high"] += 1
            elif max_confidence >= 0.5:
                stats["confidence_stats"]["medium"] += 1
            else:
                stats["confidence_stats"]["low"] += 1
            
            stats["last_updated"] = datetime.datetime.now().isoformat()
            
            if len(stats["daily_stats"]) > 30:
                dates = sorted(stats["daily_stats"].keys())
                for old_date in dates[:-30]:
                    del stats["daily_stats"][old_date]
            
            self._write_json(self.stats_file, stats)
            
        except Exception as e:
            print(f"Error updating statistics: {e}")
    
    def _save_daily_log(self, scan_entry: Dict):
        """Save scan to daily log file"""
        try:
            date = scan_entry["date"]
            daily_file = self.daily_logs_dir / f"scans_{date}.json"
            
            if daily_file.exists():
                daily_data = self._read_json(daily_file)
            else:
                daily_data = {"date": date, "scans": []}
            
            daily_data["scans"].append(scan_entry)
            
            self._write_json(daily_file, daily_data)
            
        except Exception as e:
            print(f"Error saving daily log: {e}")
    
    def get_history(self, limit: int = 50, offset: int = 0) -> Dict:
        """Get scan history with pagination"""
        try:
            history_data = self._read_json(self.scans_file)
            if not history_data or "scans" not in history_data:
                return {"history": [], "count": 0, "total": 0}
            
            scans = history_data["scans"]
            
            scans.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            
            start_idx = offset
            end_idx = offset + limit
            paginated_scans = scans[start_idx:end_idx]
            
            for scan in paginated_scans:
                if len(scan.get("email_text", "")) > 200:
                    scan["email_text"] = scan["email_text"][:200] + "..."
            
            return {
                "history": paginated_scans,
                "count": len(paginated_scans),
                "total": len(scans),
                "offset": offset,
                "limit": limit
            }
            
        except Exception as e:
            print(f"Error getting history: {e}")
            return {"history": [], "count": 0, "total": 0}
    
    def get_statistics(self) -> Dict:
        """Get overall statistics"""
        try:
            stats = self._read_json(self.stats_file)
            if not stats:
                return {
                    "total_scans": 0,
                    "classification_breakdown": {},
                    "daily_stats": {},
                    "confidence_stats": {"high": 0, "medium": 0, "low": 0},
                    "generated_at": datetime.datetime.now().isoformat()
                }
            
            stats["generated_at"] = datetime.datetime.now().isoformat()
            return stats
            
        except Exception as e:
            print(f"Error getting statistics: {e}")
            return {"error": f"Failed to load statistics: {e}"}
    
    def get_daily_summary(self, date: str = None) -> Dict:
        """Get summary for a specific date"""
        if not date:
            date = datetime.date.today().isoformat()
        
        try:
            daily_file = self.daily_logs_dir / f"scans_{date}.json"
            if not daily_file.exists():
                return {"date": date, "total": 0, "scans": []}
            
            daily_data = self._read_json(daily_file)
            
            scans = daily_data.get("scans", [])
            summary = {
                "date": date,
                "total": len(scans),
                "classifications": {},
                "avg_confidence": 0.0,
                "scans": scans
            }
            
            if scans:
                for scan in scans:
                    classification = scan.get("final_classification", "unknown")
                    summary["classifications"][classification] = summary["classifications"].get(classification, 0) + 1
                
                confidences = []
                for scan in scans:
                    max_conf = max(scan.get("spam_confidence", 0), scan.get("phishing_confidence", 0))
                    confidences.append(max_conf)
                
                if confidences:
                    summary["avg_confidence"] = sum(confidences) / len(confidences)
            
            return summary
            
        except Exception as e:
            print(f"Error getting daily summary: {e}")
            return {"date": date, "error": str(e)}
    
    def search_history(self, query: str, limit: int = 50) -> List[Dict]:
        """Search through scan history"""
        try:
            history_data = self._read_json(self.scans_file)
            if not history_data or "scans" not in history_data:
                return []
            
            results = []
            query_lower = query.lower()
            
            for scan in history_data["scans"]:
                email_text = scan.get("email_text", "").lower()
                classification = scan.get("final_classification", "").lower()
                explanation = scan.get("explanation", "").lower()
                
                if (query_lower in email_text or 
                    query_lower in classification or 
                    query_lower in explanation):
                    results.append(scan)
                
                if len(results) >= limit:
                    break
            
            return results
            
        except Exception as e:
            print(f"Error searching history: {e}")
            return []
    
    def clear_old_data(self, days_to_keep: int = 30) -> bool:
        """Clear data older than specified days"""
        try:
            cutoff_date = (datetime.date.today() - datetime.timedelta(days=days_to_keep)).isoformat()
            
            for daily_file in self.daily_logs_dir.glob("scans_*.json"):
                file_date = daily_file.stem.replace("scans_", "")
                if file_date < cutoff_date:
                    daily_file.unlink()
            
            stats = self._read_json(self.stats_file)
            if stats and "daily_stats" in stats:
                stats["daily_stats"] = {
                    date: data for date, data in stats["daily_stats"].items() 
                    if date >= cutoff_date
                }
                self._write_json(self.stats_file, stats)
            
            return True
            
        except Exception as e:
            print(f"Error clearing old data: {e}")
            return False
    
    def export_data(self, format_type: str = "json") -> str:
        """Export all data to a file"""
        try:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if format_type.lower() == "json":
                export_file = self.history_dir / f"export_{timestamp}.json"
                
                export_data = {
                    "export_timestamp": datetime.datetime.now().isoformat(),
                    "scan_history": self._read_json(self.scans_file),
                    "statistics": self._read_json(self.stats_file)
                }
                
                self._write_json(export_file, export_data)
                return str(export_file)
            
            elif format_type.lower() == "csv":
                import csv
                export_file = self.history_dir / f"export_{timestamp}.csv"
                
                history_data = self._read_json(self.scans_file)
                scans = history_data.get("scans", [])
                
                with open(export_file, 'w', newline='', encoding='utf-8') as csvfile:
                    if scans:
                        fieldnames = scans[0].keys()
                        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                        writer.writeheader()
                        writer.writerows(scans)
                
                return str(export_file)
            
        except Exception as e:
            print(f"Error exporting data: {e}")
            return ""
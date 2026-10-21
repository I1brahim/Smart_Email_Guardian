"""Server history is retired. Existing files are deliberately left untouched."""


class HistoryManager:
    def __init__(self, *args, **kwargs):
        raise RuntimeError('Server history is disabled; no email contents may be persisted')

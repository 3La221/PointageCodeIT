from datetime import datetime


def extract_time(dt):
    # Parse the ISO 8601 string into a datetime object
    if dt is None:
        return ''
    dt = datetime.fromisoformat(dt.rstrip('Z'))
    # Format the time part as HH:MM:SS
    return dt.strftime("%H:%M:%S")

def increment_column(col):
        """Increment spreadsheet column letter, e.g., 'A' -> 'B', 'Z' -> 'AA'."""
        if col == 'Z':
            return 'AA'
        elif col.endswith('Z'):
            return increment_column(col[:-1]) + 'A'
        else:
            return col[:-1] + chr(ord(col[-1]) + 1)
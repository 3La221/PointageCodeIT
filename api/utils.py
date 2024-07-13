from datetime import datetime
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c  # Distance in kilometers
    return distance

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
        

        
def is_employe_in_job(employe,longitude,latitude,bssid,ssid):
    company = employe.company
    wifis = company.wifis.all()
    for w in wifis:
            if ssid == w.ssid and bssid == w.bssid :
                return True
    if employe.current_station:
        return employe.current_station.is_employee_nearby(latitude, longitude)
    
    return False
    
    
    
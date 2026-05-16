import os, glob, re

pages_dir = r"c:\Users\SAIDAT\Desktop\REPLIC 1.0\src\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace inline grids that use auto-fit/auto-fill with className="stats-grid"
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\((?:auto-fit|auto-fill),\s*minmax\([^,]+,\s*1fr\)\)',\s*gap:\s*'([^']+)'(?:,\s*alignItems:\s*'[^']+')?\s*\}\}\>",
        r'<div className="stats-grid" style={{ gap: \'\1\' }}>',
        content
    )
    
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\((?:auto-fit|auto-fill),\s*minmax\([^,]+,\s*1fr\)\)',\s*gap:\s*'([^']+)',\s*margin(Bottom|Top):\s*'([^']+)'\s*\}\}\>",
        r'<div className="stats-grid" style={{ gap: \'\1\', margin\2: \'\3\' }}>',
        content
    )

    # Specific fixed grids replacing with updated flex-wrap classes
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'([^']+)'\s*\}\}\>",
        r'<div className="grid-2" style={{ gap: \'\1\' }}>',
        content
    )
    
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'([^']+)',\s*margin(Top|Bottom):\s*'([^']+)'\s*\}\}\>",
        r'<div className="grid-2" style={{ gap: \'\1\', margin\2: \'\3\' }}>',
        content
    )
    
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr 1fr',\s*gap:\s*'([^']+)'\s*\}\}\>",
        r'<div className="grid-3" style={{ gap: \'\1\' }}>',
        content
    )
    
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr 1fr',\s*gap:\s*'([^']+)',\s*margin(Bottom|Top):\s*'([^']+)'\s*\}\}\>",
        r'<div className="grid-3" style={{ gap: \'\1\', margin\2: \'\3\' }}>',
        content
    )
    
    content = re.sub(
        r"<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'2fr 1fr',\s*gap:\s*'([^']+)',\s*margin(Bottom|Top):\s*'([^']+)'\s*\}\}\>",
        r'<div className="charts-grid-3" style={{ gap: \'\1\', margin\2: \'\3\' }}>',
        content
    )

    # Landing page specifics
    content = content.replace(
        "<div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>",
        '<div className="grid-4" style={{ padding: \'1.5rem\', gap: \'1rem\' }}>'
    )

    content = content.replace(
        "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>",
        '<div className="stats-grid" style={{ gap: \'1.5rem\', alignItems: \'center\' }}>'
    )

    content = content.replace(
        "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>",
        '<div className="stats-grid" style={{ gap: \'1.5rem\' }}>'
    )

    content = content.replace(
        "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>",
        '<div className="stats-grid" style={{ gap: \'1.5rem\' }}>'
    )

    content = content.replace(
        "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>",
        '<div className="stats-grid" style={{ gap: \'2rem\', marginBottom: \'2rem\' }}>'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filepath in glob.glob(os.path.join(pages_dir, '*.tsx')):
    process_file(filepath)

print("Updated all inline grids in pages")

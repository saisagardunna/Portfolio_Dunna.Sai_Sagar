
import re
import os

svg_path = r'src/animation/scene.svg'
profile_path = r'src/images/profile_base64.txt'

def modify_scene_combined_v2():
    if not os.path.exists(profile_path):
        print(f"Error: {profile_path} not found.")
        return
    
    with open(profile_path, 'r') as f:
        new_image_data = f.read().strip()
    
    with open(svg_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # Signatures
    # The previous run failed because signatures didn't match line exactly
    # We should search "in line"
    targets = [
        '-857.5', 
        '-478.6', 
        '-736.3'
    ]
    
    lines_to_remove = set()
    all_xs = []
    all_ys = []
    
    print("Scanning targets...")
    for i, line in enumerate(lines):
        for sig in targets:
            if sig in line and 'points="' in line:
                lines_to_remove.add(i)
                # Parse
                m = re.search(r'points="([^"]+)"', line)
                if m:
                    pts = m.group(1).replace(',', ' ').split()
                    for k in range(0, len(pts), 2):
                        if k+1 < len(pts):
                            try:
                                all_xs.append(float(pts[k]))
                                all_ys.append(float(pts[k+1]))
                            except: pass

    if not all_xs:
        print("No targets found (v2).")
        # Fallback to hardcoded logic if needed or debug
        # But grep showed these numbers exist.
        return

    min_x, max_x = min(all_xs), max(all_xs)
    min_y, max_y = min(all_ys), max(all_ys)
    width = max_x - min_x
    height = max_y - min_y
    
    # Union Image
    img_tag = f'<image href="{new_image_data}" x="{min_x}" y="{min_y}" width="{width}" height="{height}" preserveAspectRatio="xMidYMid slice" />\n'
    
    final_lines = []
    img_inserted = False
    
    for i, line in enumerate(lines):
        # Text/Badge Updates
        if 'Associate' in line:
            line = line.replace('Associate', 'Student')
        if '>Sai<' in line:
            line = line.replace('>Sai<', '>Dunna Sai Sagar<')
        if 'href="data:image/jpeg;base64,' in line:
             line = re.sub(r'(href=["\'])data:image\/jpeg;base64,[^"\']+(["\'])', f'\\1{new_image_data}\\2', line)
        
        if i in lines_to_remove:
            if not img_inserted:
                final_lines.append(img_tag)
                img_inserted = True
            continue
        final_lines.append(line)
        
    print("Writing...")
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    print("Done.")

if __name__ == "__main__":
    modify_scene_combined_v2()

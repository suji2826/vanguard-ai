import os
import shutil

base = r"c:\Users\prath\OneDrive\Desktop\VANGAURD Ai\vanguard-ai-frontend\src\app"
target = os.path.join(base, "(authenticated)")

os.makedirs(target, exist_ok=True)

pages = ["dashboard", "asset-protection", "supply-chain", "crisis-response", "resource-allocation", "ai-explanations"]

for p in pages:
    src = os.path.join(base, p)
    dst = os.path.join(target, p)
    if os.path.exists(src):
        # use copytree then rm because rename might fail across devices or if files are open
        shutil.move(src, dst)

# move layout.jsx from dashboard to (authenticated) if it exists
dash_layout = os.path.join(target, "dashboard", "layout.jsx")
auth_layout = os.path.join(target, "layout.jsx")
if os.path.exists(dash_layout):
    shutil.move(dash_layout, auth_layout)

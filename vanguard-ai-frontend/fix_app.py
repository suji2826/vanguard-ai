import os
import shutil

src_app_dir = r"c:\Users\prath\OneDrive\Desktop\VANGAURD Ai\vanguard-ai-frontend\src\app"
root_app_dir = r"c:\Users\prath\OneDrive\Desktop\VANGAURD Ai\vanguard-ai-frontend\app"

# Overwrite src_app_dir with root_app_dir
if os.path.exists(root_app_dir):
    shutil.copytree(root_app_dir, src_app_dir, dirs_exist_ok=True)
    shutil.rmtree(root_app_dir)

css_path = os.path.join(src_app_dir, "styles", "globals.css")
with open(css_path, "w", encoding="utf-8") as f:
    f.write("""@import "tailwindcss";
@import "tailwindcss/utilities";

@layer utilities {
  .glassmorphism {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg;
  }
}
""")

# Delete default layouts from src_app_dir to prevent conflict
default_page = os.path.join(src_app_dir, 'page.tsx')
if os.path.exists(default_page): os.remove(default_page)
default_layout = os.path.join(src_app_dir, 'layout.tsx')
if os.path.exists(default_layout): os.remove(default_layout)
default_css = os.path.join(src_app_dir, 'globals.css')
if os.path.exists(default_css): os.remove(default_css)

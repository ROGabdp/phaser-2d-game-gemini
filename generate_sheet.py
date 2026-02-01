import os
from PIL import Image
import glob

def create_spritesheet(source_dir, output_file, target_height=64):
    # Find all PNGs
    files = sorted(glob.glob(os.path.join(source_dir, "*.png")))
    if not files:
        print("No PNG files found in", source_dir)
        return

    images = []
    for f in files:
        try:
            img = Image.open(f)
            # Calculate new width maintaining aspect ratio
            aspect = img.width / img.height
            new_width = int(target_height * aspect)
            img_resized = img.resize((new_width, target_height), Image.Resampling.LANCZOS)
            images.append(img_resized)
        except Exception as e:
            print(f"Error loading {f}: {e}")

    if not images:
        return

    # Create sheet
    total_width = sum(img.width for img in images)
    max_height = target_height
    
    sheet = Image.new("RGBA", (total_width, max_height), (0, 0, 0, 0))
    
    current_x = 0
    for img in images:
        sheet.paste(img, (current_x, 0))
        current_x += img.width
    
    sheet.save(output_file)
    print(f"Created spritesheet: {output_file}")
    print(f"Dimensions: {total_width}x{max_height}")
    print(f"Frame Count: {len(images)}")
    print(f"Frame Size: {images[0].width}x{target_height}")

if __name__ == "__main__":
    source = "d:/000-github-repositories/phaser-2d-game-gemini/public/assets/oakwoods/character/mask_boy_01"
    output = "d:/000-github-repositories/phaser-2d-game-gemini/public/assets/oakwoods/character/mask_boy_idle.png"
    create_spritesheet(source, output, target_height=64)

import re

file_path = r"d:\Amey-Portfolio-main\Amey-Portfolio-main\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Hero Image
content = content.replace(
    '<div class="hero-image-wrapper anti-gravity">\n                <img src="static/images/mypic.png" alt="Ameya Hatekar" class="hero-profile-pic">\n            </div>',
    '<div class="hero-image-wrapper">\n                <div class="float-wrapper float-slow">\n                    <img src="static/images/mypic.png" alt="Ameya Hatekar" class="hero-profile-pic">\n                </div>\n            </div>'
)

# 2. Project Cards
# Replace opening
content = content.replace(
    '<div class="project-container reveal-up anti-gravity">\n                        <div class="project-flipper">',
    '<div class="project-container reveal-up">\n                        <div class="float-wrapper float-medium">\n                            <div class="project-flipper">'
)
# Replace closing
content = content.replace(
    '                        </div>\n                    </div>\n                </a>',
    '                            </div>\n                        </div>\n                    </div>\n                </a>'
)

# 3. Skill Cards
content = re.sub(
    r'<div class="skill-card anti-gravity" data-score="(\d+)">',
    r'<div class="skill-card" data-score="\1">\n                    <div class="float-wrapper float-micro">',
    content
)

content = content.replace(
    '                    </div>\n                </div>\n                <div class="skill-card',
    '                        </div>\n                    </div>\n                </div>\n                <div class="skill-card'
)
# Last skill card closes before </div>
content = content.replace(
    '                    </div>\n                </div>\n            </div>\n        </section>',
    '                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>'
)

# 4. Experience Cards (border-wrap anti-gravity)
content = re.sub(
    r'<div class="border-wrap anti-gravity" style="([^"]+)">\n                        <div class="border-inner">',
    r'<div class="border-wrap" style="\1">\n                        <div class="float-wrapper float-micro">\n                            <div class="border-inner">',
    content
)
content = content.replace(
    '                        </div>\n                    </div>\n                </div>',
    '                            </div>\n                        </div>\n                    </div>\n                </div>'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("HTML update complete.")

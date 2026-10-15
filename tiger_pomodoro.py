#!/usr/bin/env python3
"""
Tiger & Friends Pomodoro - Standalone Desktop Application (Python & Tkinter)
Includes 5 cute pixel art companions:
- 🐯 Tiger (Tora)
- 🦛 Flodhest / Hippo (Pippo)
- 🐷 Gris / Pig (Nøff)
- 🐹 Marsvin / Guinea Pig (Pip)
- 🥑 Avokado / Avocado (Avo)

Zero external pip dependencies required - runs with Python standard library.
"""

import tkinter as tk
from tkinter import ttk, messagebox
import time
import math
import sys
import os

try:
    import winsound
    HAS_WINSOUND = True
except ImportError:
    HAS_WINSOUND = False


class PixelCompanionCanvas(tk.Canvas):
    """
    Procedural Pixel Art Companion Canvas
    Renders 5 cute companions on a 32x32 pixel grid scaled at 4x (128x128).
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, width=130, height=130, bg="#FFF6EB", highlightthickness=0, **kwargs)
        self.grid_size = 32
        self.scale = 4

        self.skin = "tiger"  # 'tiger', 'hippo', 'pig', 'guineapig', 'avocado'
        self.state = "focus"  # 'focus', 'paused', 'shortBreak', 'longBreak', 'timesUp'
        self.is_running = False

        self.frame = 0
        self.blink_counter = 0
        self.is_blinking = False
        self.head_bob = 0
        self.particles = []

        self.bind("<Button-1>", self.on_click)
        self.animate()

    def on_click(self, event):
        self.spawn_confetti(8)

    def set_skin(self, skin):
        self.skin = skin
        self.spawn_confetti(8)

    def set_state(self, state, is_running=True):
        self.state = state
        self.is_running = is_running
        if state == "timesUp":
            self.spawn_confetti(25)

    def spawn_confetti(self, count):
        colors = ["#FF7675", "#FEEAA7", "#55EFC4", "#74B9FF", "#FFA35C"]
        import random
        for _ in range(count):
            self.particles.append({
                "type": "confetti",
                "x": 16 + (random.random() - 0.5) * 8,
                "y": 12 + (random.random() - 0.5) * 6,
                "vx": (random.random() - 0.5) * 1.5,
                "vy": -1.2 - random.random() * 1.2,
                "color": random.choice(colors),
                "life": random.randint(25, 45)
            })

    def draw_pixel(self, x, y, color):
        x1 = x * self.scale
        y1 = y * self.scale
        x2 = x1 + self.scale
        y2 = y1 + self.scale
        self.create_rectangle(x1, y1, x2, y2, fill=color, outline=color)

    def draw_rect(self, x, y, w, h, color):
        x1 = x * self.scale
        y1 = y * self.scale
        x2 = x1 + w * self.scale
        y2 = y1 + h * self.scale
        self.create_rectangle(x1, y1, x2, y2, fill=color, outline=color)

    def animate(self):
        self.frame += 1

        # Blinking logic
        self.blink_counter += 1
        if self.blink_counter > 150:
            self.is_blinking = True
            if self.blink_counter > 158:
                self.is_blinking = False
                self.blink_counter = 0

        # Head bob
        if self.state == "focus" and self.is_running:
            self.head_bob = 1 if math.sin(self.frame * 0.2) > 0.5 else 0
        elif self.state == "timesUp":
            self.head_bob = -1 if (self.frame // 4) % 2 == 0 else 1
        else:
            self.head_bob = 1 if (self.frame // 30) % 2 == 0 else 0

        self.render()
        self.after(50, self.animate)

    def render(self):
        self.delete("all")
        bob = self.head_bob

        if self.skin == "hippo":
            self.render_hippo(bob)
        elif self.skin == "pig":
            self.render_pig(bob)
        elif self.skin == "guineapig":
            self.render_guinea_pig(bob)
        elif self.skin == "avocado":
            self.render_avocado(bob)
        else:
            self.render_tiger(bob)

        # Focus Headphones
        head_y = (5 if self.skin == "avocado" else 6) + bob
        if self.state == "focus":
            self.draw_rect(8, head_y - 2, 16, 2, "#7C5CBF")
            self.draw_rect(4, head_y + 2, 3, 6, "#A29BFE")
            self.draw_rect(5, head_y + 3, 2, 4, "#55EFC4")
            self.draw_rect(25, head_y + 2, 3, 6, "#A29BFE")
            self.draw_rect(25, head_y + 3, 2, 4, "#55EFC4")
        elif self.state in ["shortBreak", "longBreak"] and self.state != "timesUp":
            # Cozy Mug
            self.draw_rect(13, 22, 6, 5, "#74B9FF")
            self.draw_rect(14, 22, 4, 1, "#8D6E63")
            self.draw_rect(19, 23, 1, 3, "#74B9FF")

        # Celebration Paws
        if self.state == "timesUp":
            color = "#95D5B2" if self.skin == "avocado" else ("#FFB3C1" if self.skin == "pig" else "#FFF5E8")
            self.draw_rect(4, head_y + 2, 3, 3, color)
            self.draw_rect(25, head_y + 2, 3, 3, color)

        # Particles update & render
        for p in list(self.particles):
            p["life"] -= 1
            p["x"] += p["vx"]
            p["y"] += p["vy"]
            if p["life"] <= 0:
                self.particles.remove(p)
            else:
                self.draw_rect(int(p["x"]), int(p["y"]), 2, 2, p["color"])

    def draw_eyes(self, head_y, left_x, right_x, pupil_col="#241B19"):
        eye_y = head_y + 5
        if self.is_blinking and self.state != "timesUp":
            self.draw_rect(left_x, eye_y + 1, 3, 1, pupil_col)
            self.draw_rect(right_x, eye_y + 1, 3, 1, pupil_col)
        elif self.state in ["shortBreak", "longBreak", "timesUp"]:
            # Happy eyes ^ ^
            self.draw_pixel(left_x, eye_y + 1, pupil_col)
            self.draw_pixel(left_x + 1, eye_y, pupil_col)
            self.draw_pixel(left_x + 2, eye_y + 1, pupil_col)
            self.draw_pixel(right_x, eye_y + 1, pupil_col)
            self.draw_pixel(right_x + 1, eye_y, pupil_col)
            self.draw_pixel(right_x + 2, eye_y + 1, pupil_col)
        elif self.state == "paused":
            self.draw_rect(left_x, eye_y, 3, 3, pupil_col)
            self.draw_pixel(left_x, eye_y, "#FFFFFF")
            self.draw_rect(right_x, eye_y - 1, 3, 3, pupil_col)
            self.draw_pixel(right_x, eye_y - 1, "#FFFFFF")
        else:
            self.draw_rect(left_x, eye_y, 3, 3, pupil_col)
            self.draw_pixel(left_x, eye_y, "#FFFFFF")
            self.draw_rect(right_x, eye_y, 3, 3, pupil_col)
            self.draw_pixel(right_x, eye_y, "#FFFFFF")

    # 1. Tiger
    def render_tiger(self, bob):
        c_orange = "#FFA35C"
        c_stripe = "#3A302E"
        c_cream = "#FFF5E8"

        # Tail
        tail_offset = 1 if (self.frame // 25) % 2 == 0 else 0
        self.draw_rect(24 + tail_offset, 21, 3, 2, c_orange)
        self.draw_rect(26 + tail_offset, 22, 3, 2, c_stripe)
        self.draw_rect(28, 20 - tail_offset, 2, 2, c_cream)

        # Body
        self.draw_rect(6, 26, 4, 3, c_orange)
        self.draw_rect(22, 26, 4, 3, c_orange)
        self.draw_rect(9, 18, 14, 9, c_orange)
        self.draw_rect(8, 20, 16, 7, c_orange)
        self.draw_rect(12, 19, 8, 8, c_cream)

        # Ears
        ear_y = 2 + bob
        self.draw_rect(6, ear_y + 1, 5, 5, c_orange)
        self.draw_rect(7, ear_y, 3, 2, c_stripe)
        self.draw_rect(21, ear_y + 1, 5, 5, c_orange)
        self.draw_rect(22, ear_y, 3, 2, c_stripe)

        # Head & Stripes
        head_y = 6 + bob
        self.draw_rect(8, head_y, 16, 12, c_orange)
        self.draw_rect(6, head_y + 4, 20, 6, c_orange)
        self.draw_rect(15, head_y + 1, 2, 4, c_stripe)
        self.draw_rect(13, head_y + 2, 6, 1, c_stripe)
        self.draw_rect(11, head_y + 7, 10, 5, c_cream)
        self.draw_rect(15, head_y + 8, 2, 2, "#FF758F")
        self.draw_rect(8, head_y + 9, 3, 2, "#FFAAA6")
        self.draw_rect(21, head_y + 9, 3, 2, "#FFAAA6")

        self.draw_eyes(head_y, 10, 19)

        if self.state not in ["shortBreak", "longBreak", "timesUp"]:
            self.draw_rect(10, 23, 3, 4, c_cream)
            self.draw_rect(19, 23, 3, 4, c_cream)

    # 2. Hippo
    def render_hippo(self, bob):
        c_blue = "#9AAEC4"
        c_belly = "#E6EEF8"
        c_snout = "#BDCCE0"
        c_dark = "#576A80"

        # Body
        self.draw_rect(5, 26, 5, 3, c_blue)
        self.draw_rect(22, 26, 5, 3, c_blue)
        self.draw_rect(8, 18, 16, 9, c_blue)
        self.draw_rect(11, 19, 10, 8, c_belly)

        # Ears
        ear_y = 2 + bob
        self.draw_rect(6, ear_y + 1, 4, 4, c_blue)
        self.draw_rect(22, ear_y + 1, 4, 4, c_blue)

        # Head & Big Snout
        head_y = 6 + bob
        self.draw_rect(8, head_y, 16, 11, c_blue)
        self.draw_rect(9, head_y + 6, 14, 7, c_snout)
        self.draw_rect(13, head_y + 8, 2, 2, c_dark)
        self.draw_rect(17, head_y + 8, 2, 2, c_dark)
        self.draw_pixel(11, head_y + 13, "#FFFFFF")
        self.draw_pixel(20, head_y + 13, "#FFFFFF")

        self.draw_rect(7, head_y + 9, 3, 2, "#FFAEC0")
        self.draw_rect(22, head_y + 9, 3, 2, "#FFAEC0")

        self.draw_eyes(head_y, 9, 20, "#222B36")

        if self.state not in ["shortBreak", "longBreak", "timesUp"]:
            self.draw_rect(9, 23, 4, 4, c_blue)
            self.draw_rect(19, 23, 4, 4, c_blue)

    # 3. Pig
    def render_pig(self, bob):
        c_pink = "#FFB3C1"
        c_snout = "#FF8DA1"
        c_nostrils = "#D65D74"

        # Curly tail
        self.draw_rect(24, 21, 2, 2, c_pink)
        self.draw_pixel(26, 20, c_snout)

        # Body
        self.draw_rect(6, 26, 4, 3, c_pink)
        self.draw_rect(22, 26, 4, 3, c_pink)
        self.draw_rect(8, 18, 16, 9, c_pink)
        self.draw_rect(11, 19, 10, 8, "#FFE5EC")

        # Ears
        ear_y = 2 + bob
        self.draw_rect(6, ear_y + 1, 4, 5, c_pink)
        self.draw_rect(22, ear_y + 2, 4, 4, c_pink)

        # Head & Snout
        head_y = 6 + bob
        self.draw_rect(8, head_y, 16, 12, c_pink)
        self.draw_rect(11, head_y + 7, 10, 5, c_snout)
        self.draw_rect(13, head_y + 8, 2, 2, c_nostrils)
        self.draw_rect(17, head_y + 8, 2, 2, c_nostrils)

        self.draw_rect(7, head_y + 8, 3, 2, "#FF6384")
        self.draw_rect(22, head_y + 8, 3, 2, "#FF6384")

        self.draw_eyes(head_y, 9, 20, "#2A1C20")

        if self.state not in ["shortBreak", "longBreak", "timesUp"]:
            self.draw_rect(10, 23, 3, 4, c_pink)
            self.draw_rect(19, 23, 3, 4, c_pink)

    # 4. Guinea Pig
    def render_guinea_pig(self, bob):
        c_brown = "#C68B59"
        c_white = "#FFF9F0"
        c_dark = "#855831"

        # Body
        self.draw_rect(7, 18, 18, 9, c_brown)
        self.draw_rect(13, 18, 7, 10, c_white)
        self.draw_rect(21, 20, 5, 7, c_dark)
        self.draw_rect(5, 26, 4, 3, c_brown)
        self.draw_rect(23, 26, 4, 3, c_dark)

        # Ears
        ear_y = 4 + bob
        self.draw_rect(5, ear_y, 3, 4, c_brown)
        self.draw_rect(24, ear_y, 3, 4, c_dark)

        # Head
        head_y = 6 + bob
        self.draw_rect(8, head_y, 16, 12, c_brown)
        self.draw_rect(19, head_y + 2, 7, 9, c_dark)
        self.draw_rect(14, head_y + 1, 4, 11, c_white)
        self.draw_rect(14, head_y + 9, 4, 2, "#FF8E9E")

        self.draw_rect(7, head_y + 9, 3, 2, "#FFB0B0")
        self.draw_rect(22, head_y + 9, 3, 2, "#FFB0B0")

        self.draw_eyes(head_y, 9, 20, "#231815")

        if self.state not in ["shortBreak", "longBreak", "timesUp"]:
            self.draw_rect(10, 23, 3, 4, c_white)
            self.draw_rect(19, 23, 3, 4, c_white)
            self.draw_rect(14, 23, 4, 2, "#52B788")

    # 5. Avocado
    def render_avocado(self, bob):
        c_peel = "#2D6A4F"
        c_flesh = "#95D5B2"
        c_pit = "#8B5A2B"

        # Stem & Leaf
        stem_y = 1 + bob
        self.draw_rect(15, stem_y + 1, 2, 3, "#583101")
        self.draw_rect(17, stem_y, 4, 2, "#52B788")

        # Pear Shape
        body_y = 5 + bob
        self.draw_rect(8, body_y + 4, 16, 7, c_peel)
        self.draw_rect(6, body_y + 11, 20, 11, c_peel)
        self.draw_rect(9, body_y + 5, 14, 7, c_flesh)
        self.draw_rect(7, body_y + 12, 18, 9, c_flesh)

        # Center Pit
        pit_y = body_y + 11
        self.draw_rect(11, pit_y + 1, 10, 7, c_pit)
        self.draw_rect(13, pit_y + 1, 2, 2, "#A47148")

        self.draw_rect(8, body_y + 8, 3, 2, "#FF9EA8")
        self.draw_rect(21, body_y + 8, 3, 2, "#FF9EA8")
        self.draw_pixel(15, body_y + 9, "#1B4332")
        self.draw_pixel(16, body_y + 9, "#1B4332")

        self.draw_eyes(body_y + 1, 10, 19, "#1B4332")

        self.draw_rect(10, 27, 3, 3, c_peel)
        self.draw_rect(19, 27, 3, 3, c_peel)


class CompanionPomodoroApp:
    """
    Main Pomodoro Application Window with Skin & Sound Selectors
    """
    def __init__(self, root):
        self.root = root
        self.root.title("Tiger & Friends Pomodoro")
        self.root.geometry("370x640")
        self.root.resizable(False, False)
        self.root.configure(bg="#FFFDF8")

        self.bg_color = "#FFFDF8"
        self.card_color = "#FFF6EB"
        self.orange = "#FFA35C"
        self.charcoal = "#3A302E"

        self.lang = "no"
        self.sound_type = "chime"  # 'chime', 'retro', 'marimba', 'digital', 'harp'
        self.sound_enabled = True

        self.mode = "focus"
        self.is_running = False
        self.total_duration = 25 * 60
        self.remaining_seconds = 25 * 60
        self.completed_sessions = 0
        self.timer_job = None

        self.characters = {
            "tiger": {
                "name": {"no": "Tiger", "en": "Tiger"},
                "icon": "🐯",
                "title": "TORA TIMER",
                "focus": {"no": "Klar til fokus med Tiger!", "en": "Ready to focus with Tiger!"}
            },
            "hippo": {
                "name": {"no": "Flodhest", "en": "Hippo"},
                "icon": "🦛",
                "title": "PIPPO TIMER",
                "focus": {"no": "Flodhesten holder roen med deg!", "en": "Hippo stays calm with you!"}
            },
            "pig": {
                "name": {"no": "Gris", "en": "Pig"},
                "icon": "🐷",
                "title": "NØFF TIMER",
                "focus": {"no": "Grisen heier på deg! Nøff!", "en": "Piggy is cheering for you! Oink!"}
            },
            "guineapig": {
                "name": {"no": "Marsvin", "en": "Guinea Pig"},
                "icon": "🐹",
                "title": "PIP TIMER",
                "focus": {"no": "Marsvinet gomler fokus!", "en": "Guinea Pig munches on focus!"}
            },
            "avocado": {
                "name": {"no": "Avokado", "en": "Avocado"},
                "icon": "🥑",
                "title": "AVO TIMER",
                "focus": {"no": "Avokadoen holder hodet friskt!", "en": "Avocado keeps your mind fresh!"}
            }
        }
        self.current_skin = "tiger"

        self.build_ui()

    def toggle_lang(self):
        self.lang = "en" if self.lang == "no" else "no"
        self.btn_lang.config(text="🌐 EN" if self.lang == "en" else "🌐 NO")
        meta = self.characters[self.current_skin]
        self.lbl_speech.config(text=f"{meta['icon']} {meta['focus'][self.lang]}")
        self.lbl_custom.config(text="Custom:" if self.lang == "en" else "Egendefinert:")
        self.lbl_sessions.config(text=f"🐾 {self.completed_sessions % 4}/4 {'Completed' if self.lang == 'en' else 'Fullført'}")

    def build_ui(self):
        # Top Bar
        top_bar = tk.Frame(self.root, bg=self.card_color, height=36, relief="groove", bd=1)
        top_bar.pack(fill="x", side="top")

        self.lbl_title = tk.Label(top_bar, text="🐯 TORA TIMER", font=("Courier", 10, "bold"),
                                  bg=self.card_color, fg=self.charcoal)
        self.lbl_title.pack(side="left", padx=10, pady=6)

        self.topmost_var = tk.BooleanVar(value=False)
        chk_top = tk.Checkbutton(top_bar, text="📌 Pin", variable=self.topmost_var,
                                 command=self.toggle_topmost, bg=self.card_color,
                                 activebackground=self.card_color, font=("Segoe UI", 9))
        chk_top.pack(side="right", padx=4)

        self.btn_sound = tk.Button(top_bar, text="🔔", command=self.toggle_sound,
                                   bg=self.card_color, relief="flat", font=("Segoe UI", 9))
        self.btn_sound.pack(side="right", padx=2)

        self.btn_lang = tk.Button(top_bar, text="🌐 NO", command=self.toggle_lang,
                                  bg=self.card_color, relief="flat", font=("Segoe UI", 9, "bold"))
        self.btn_lang.pack(side="right", padx=2)

        # Content Frame
        content = tk.Frame(self.root, bg=self.bg_color, padx=14, pady=8)
        content.pack(fill="both", expand=True)

        # Quick Skin Switcher Bar
        skin_bar = tk.Frame(content, bg=self.card_color, relief="solid", bd=1, padx=4, pady=4)
        skin_bar.pack(fill="x", pady=(0, 6))

        for skin_key, data in self.characters.items():
            btn = tk.Button(skin_bar, text=f"{data['icon']} {data['name']}", font=("Segoe UI", 8, "bold"),
                            bg="white", relief="solid", bd=1,
                            command=lambda s=skin_key: self.select_skin(s))
            btn.pack(side="left", expand=True, fill="x", padx=1)

        # Speech Bubble
        self.lbl_speech = tk.Label(content, text="🎧 Klar til fokus med Tiger!",
                                   font=("Segoe UI", 10, "bold"), bg="white", fg=self.charcoal,
                                   relief="solid", bd=1, padx=8, pady=4)
        self.lbl_speech.pack(fill="x", pady=(0, 4))

        # Companion Canvas
        stage_frame = tk.Frame(content, bg=self.card_color, relief="solid", bd=1, padx=6, pady=4)
        stage_frame.pack(pady=2)

        self.companion_canvas = PixelCompanionCanvas(stage_frame)
        self.companion_canvas.pack()

        self.lbl_sessions = tk.Label(stage_frame, text="🐾 0/4 Fullført", font=("Segoe UI", 9, "bold"),
                                     bg=self.card_color, fg="#8E7C77")
        self.lbl_sessions.pack(pady=(2, 0))

        # Timer Display
        timer_frame = tk.Frame(content, bg="white", relief="solid", bd=2, pady=6)
        timer_frame.pack(fill="x", pady=6)

        self.lbl_timer = tk.Label(timer_frame, text="25:00", font=("Courier", 30, "bold"),
                                  bg="white", fg=self.charcoal)
        self.lbl_timer.pack()

        # Presets
        presets_frame = tk.Frame(content, bg=self.bg_color)
        presets_frame.pack(fill="x", pady=3)

        presets = [
            ("25m Fokus", "focus", 25 * 60),
            ("5m Kort", "shortBreak", 5 * 60),
            ("15m Lang", "longBreak", 15 * 60),
            ("50m Dyp", "deep", 50 * 60),
        ]
        for text, mode, secs in presets:
            btn = tk.Button(presets_frame, text=text, font=("Segoe UI", 9, "bold"),
                            bg=self.card_color, fg=self.charcoal, relief="solid", bd=1,
                            command=lambda m=mode, s=secs: self.select_preset(m, s))
            btn.pack(side="left", expand=True, fill="x", padx=2)

        # Sound Selector Bar
        sound_frame = tk.Frame(content, bg=self.card_color, relief="solid", bd=1, padx=6, pady=4)
        sound_frame.pack(fill="x", pady=4)

        tk.Label(sound_frame, text="🔔 Lyd:", font=("Segoe UI", 8, "bold"),
                 bg=self.card_color, fg="#8E7C77").pack(side="left", padx=2)

        self.combo_sound = ttk.Combobox(sound_frame, values=[
            "Klokkespill (Chime)",
            "8-Bit Arkade",
            "Marimba / Kalimba",
            "Digital Klokke",
            "Magisk Harpe"
        ], state="readonly", width=18, font=("Segoe UI", 8))
        self.combo_sound.current(0)
        self.combo_sound.pack(side="left", padx=4)
        self.combo_sound.bind("<<ComboboxSelected>>", self.on_sound_changed)

        btn_test_snd = tk.Button(sound_frame, text="▶ Test", font=("Segoe UI", 8, "bold"),
                                 relief="solid", bd=1, bg="white", command=self.play_alert)
        btn_test_snd.pack(side="right", padx=2)

        # Custom Time (HH:MM:SS)
        custom_frame = tk.Frame(content, bg=self.card_color, relief="solid", bd=1, padx=6, pady=3)
        custom_frame.pack(fill="x", pady=4)

        self.lbl_custom = tk.Label(custom_frame, text="Egendefinert:", font=("Segoe UI", 8, "bold"),
                                   bg=self.card_color, fg="#8E7C77")
        self.lbl_custom.pack(side="left", padx=(0, 4))

        self.entry_h = tk.Spinbox(custom_frame, from_=0, to=99, width=3, justify="center", font=("Courier", 9))
        self.entry_h.delete(0, "end")
        self.entry_h.insert(0, "00")
        self.entry_h.pack(side="left")

        tk.Label(custom_frame, text=":", font=("Courier", 9, "bold"), bg=self.card_color).pack(side="left")

        self.entry_m = tk.Spinbox(custom_frame, from_=0, to=59, width=3, justify="center", font=("Courier", 9))
        self.entry_m.delete(0, "end")
        self.entry_m.insert(0, "25")
        self.entry_m.pack(side="left")

        tk.Label(custom_frame, text=":", font=("Courier", 9, "bold"), bg=self.card_color).pack(side="left")

        self.entry_s = tk.Spinbox(custom_frame, from_=0, to=59, width=3, justify="center", font=("Courier", 9))
        self.entry_s.delete(0, "end")
        self.entry_s.insert(0, "00")
        self.entry_s.pack(side="left")

        btn_set = tk.Button(custom_frame, text="Sett", font=("Segoe UI", 8, "bold"),
                            command=self.set_custom_time, relief="solid", bd=1, bg="white")
        btn_set.pack(side="right", padx=(4, 0))

        # Controls
        controls_frame = tk.Frame(content, bg=self.bg_color)
        controls_frame.pack(fill="x", pady=6)

        self.btn_reset = tk.Button(controls_frame, text="↺", font=("Segoe UI", 13, "bold"),
                                   width=3, bg="white", relief="solid", bd=1, command=self.reset_timer)
        self.btn_reset.pack(side="left", padx=3)

        self.btn_toggle = tk.Button(controls_frame, text="▶ START", font=("Segoe UI", 11, "bold"),
                                    bg=self.orange, fg="white", relief="solid", bd=1, command=self.toggle_timer)
        self.btn_toggle.pack(side="left", expand=True, fill="x", padx=3)

        self.btn_skip = tk.Button(controls_frame, text="⏭", font=("Segoe UI", 13, "bold"),
                                  width=3, bg="white", relief="solid", bd=1, command=self.skip_timer)
        self.btn_skip.pack(side="left", padx=3)

    def select_skin(self, skin):
        self.current_skin = skin
        self.companion_canvas.set_skin(skin)
        meta = self.characters[skin]
        self.lbl_title.config(text=f"{meta['icon']} {meta['title']}")
        self.lbl_speech.config(text=f"{meta['icon']} {meta['focus'][self.lang]}")

    def on_sound_changed(self, event):
        idx = self.combo_sound.current()
        types = ["chime", "retro", "marimba", "digital", "harp"]
        if 0 <= idx < len(types):
            self.sound_type = types[idx]
        self.play_alert()

    def toggle_topmost(self):
        self.root.attributes("-topmost", self.topmost_var.get())

    def toggle_sound(self):
        self.sound_enabled = not self.sound_enabled
        self.btn_sound.config(text="🔔" if self.sound_enabled else "🔇")

    def play_alert(self):
        if not self.sound_enabled:
            return
        if HAS_WINSOUND:
            try:
                if self.sound_type == "retro":
                    winsound.Beep(392, 100)
                    winsound.Beep(523, 100)
                    winsound.Beep(659, 100)
                    winsound.Beep(1046, 250)
                elif self.sound_type == "marimba":
                    winsound.Beep(349, 120)
                    winsound.Beep(440, 120)
                    winsound.Beep(523, 200)
                elif self.sound_type == "digital":
                    winsound.Beep(2048, 80)
                    winsound.Beep(2048, 80)
                    time.sleep(0.1)
                    winsound.Beep(2048, 80)
                    winsound.Beep(2048, 80)
                elif self.sound_type == "harp":
                    for f in [523, 659, 784, 880, 1046, 1318]:
                        winsound.Beep(f, 60)
                else:  # chime
                    winsound.Beep(523, 150)
                    winsound.Beep(659, 150)
                    winsound.Beep(784, 180)
                    winsound.Beep(1046, 300)
            except Exception:
                self.root.bell()
        else:
            self.root.bell()

    def select_preset(self, mode, secs):
        self.pause_timer()
        self.mode = mode
        self.total_duration = secs
        self.remaining_seconds = secs
        self.update_display()
        self.sync_spinboxes(secs)
        self.companion_canvas.set_state(mode, False)
        meta = self.characters[self.current_skin]
        self.lbl_speech.config(text=f"Klar for {mode.capitalize()}!")

    def set_custom_time(self):
        try:
            h = int(self.entry_h.get())
            m = int(self.entry_m.get())
            s = int(self.entry_s.get())
            total = h * 3600 + m * 60 + s
            if total <= 0:
                messagebox.showwarning("Ugyldig Tid", "Vennligst sett minst 1 sekund.")
                return
            self.pause_timer()
            self.mode = "custom"
            self.total_duration = total
            self.remaining_seconds = total
            self.update_display()
            self.companion_canvas.set_state("focus", False)
            self.lbl_speech.config(text=f"Egendefinert: {h:02d}:{m:02d}:{s:02d}")
        except ValueError:
            messagebox.showerror("Feil", "Vennligst skriv inn gyldige tall.")

    def sync_spinboxes(self, total_secs):
        h = total_secs // 3600
        m = (total_secs % 3600) // 60
        s = total_secs % 60
        self.entry_h.delete(0, "end")
        self.entry_h.insert(0, f"{h:02d}")
        self.entry_m.delete(0, "end")
        self.entry_m.insert(0, f"{m:02d}")
        self.entry_s.delete(0, "end")
        self.entry_s.insert(0, f"{s:02d}")

    def toggle_timer(self):
        if self.is_running:
            self.pause_timer()
        else:
            self.start_timer()

    def start_timer(self):
        self.is_running = True
        self.btn_toggle.config(text="⏸ PAUSE", bg="#2ED573")
        self.companion_canvas.set_state(self.mode if self.mode != "custom" else "focus", True)
        meta = self.characters[self.current_skin]
        self.lbl_speech.config(text=f"🎧 {meta['name']} fokuserer med deg!")
        self.tick()

    def pause_timer(self):
        self.is_running = False
        if self.timer_job:
            self.root.after_cancel(self.timer_job)
            self.timer_job = None
        self.btn_toggle.config(text="▶ START", bg=self.orange)
        self.companion_canvas.set_state("paused", False)
        meta = self.characters[self.current_skin]
        self.lbl_speech.config(text=f"⏸️ {meta['name']} venter på deg...")

    def reset_timer(self):
        self.pause_timer()
        self.remaining_seconds = self.total_duration
        self.update_display()
        self.companion_canvas.set_state(self.mode if self.mode != "custom" else "focus", False)
        self.lbl_speech.config(text="↺ Timer tilbakestilt.")

    def skip_timer(self):
        self.pause_timer()
        if self.mode in ["focus", "deep", "custom"]:
            self.completed_sessions += 1
            if self.completed_sessions % 4 == 0:
                self.select_preset("longBreak", 15 * 60)
            else:
                self.select_preset("shortBreak", 5 * 60)
        else:
            self.select_preset("focus", 25 * 60)
        self.update_sessions_display()

    def tick(self):
        if not self.is_running:
            return

        if self.remaining_seconds > 0:
            self.remaining_seconds -= 1
            self.update_display()
            self.timer_job = self.root.after(1000, self.tick)
        else:
            self.handle_complete()

    def handle_complete(self):
        self.pause_timer()
        self.play_alert()
        self.companion_canvas.set_state("timesUp", True)
        meta = self.characters[self.current_skin]

        if self.mode in ["focus", "deep", "custom"]:
            self.completed_sessions += 1
            self.update_sessions_display()
            self.lbl_speech.config(text=f"🎉 Fokus fullført med {meta['name']}!")
            messagebox.showinfo("Pomodoro", f"Tiden er ute! Godt jobbet med {meta['name']}! Ta en koselig pause.")
        else:
            self.lbl_speech.config(text="✨ Pausen er over!")
            messagebox.showinfo("Pomodoro", f"Pausen er over! Klar for en ny runde med {meta['name']}?")

    def update_sessions_display(self):
        cycle = self.completed_sessions % 4
        paws = "🐾 " * cycle + "⚪ " * (4 - cycle)
        self.lbl_sessions.config(text=f"{paws} {cycle}/4 Fullført")

    def update_display(self):
        secs = max(0, self.remaining_seconds)
        h = secs // 3600
        m = (secs % 3600) // 60
        s = secs % 60
        if h > 0:
            self.lbl_timer.config(text=f"{h:02d}:{m:02d}:{s:02d}")
        else:
            self.lbl_timer.config(text=f"{m:02d}:{s:02d}")


def main():
    root = tk.Tk()
    app = CompanionPomodoroApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()

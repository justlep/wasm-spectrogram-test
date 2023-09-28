@ffmpeg -hide_banner -y -i sweep-20-20000hz-48k-linear.wav -lavfi showspectrumpic=size=800x4096:color=fire:legend=0 sweep-20-20000hz-48k-linear.png
@ffmpeg -hide_banner -y -i sweep-20-22000hz-48k-linear.wav -lavfi showspectrumpic=size=800x4096:color=fire:legend=0 sweep-20-22000hz-48k-linear.png
@ffmpeg -hide_banner -y -i sweep-20-24000hz-48k-linear.wav -lavfi showspectrumpic=size=800x4096:color=fire:legend=0 sweep-20-24000hz-48k-linear.png

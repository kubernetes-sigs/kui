# Creating template images

The Electron Tray menu requires "template" images. These must be
grayscale images. We use imagemagick's otsu thresholder to do so, and
then create two small template images from that.

```shell
magick kui.png -alpha off -auto-threshold otsu z.png
convert z.png -resize 18x18 kuiTemplate.png
convert z.png -resize 36x36 kuiTemplate@2x.png
rm z.png
```

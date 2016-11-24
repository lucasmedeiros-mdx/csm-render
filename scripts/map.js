class Map {
    constructor(name, imageMask, image, width, height) {
        this.name = name;
        this.image = image;
        this.imageMask = imageMask;
        this.width = width;
        this.height = height;
        this.loaded = !1;
    }
}
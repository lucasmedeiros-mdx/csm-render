"use strict";

var ShapeFactory = {
    createShape: function createShape(shapeRequest) {
        switch (shapeRequest.shapeType) {
            case Api.settings.EnumShape.Waypoint:
                return new Waypoint(shapeRequest.player, shapeRequest.position, shapeRequest.context, shapeRequest.text);
            case Api.settings.EnumShape.Syncpoint:
                return new Syncpoint(shapeRequest.player, shapeRequest.position, shapeRequest.context, shapeRequest.text);
            case Api.settings.EnumShape.Camppoint:
                return new Camppoint(shapeRequest.player, shapeRequest.position, shapeRequest.context, shapeRequest.text);
            case Api.settings.EnumShape.Waitpoint:
                return new Waitpoint(shapeRequest.player, shapeRequest.position, shapeRequest.context, shapeRequest.text);
        }
    }
};
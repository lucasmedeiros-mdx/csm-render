(function(CSMApi) {

    CSMApi.ShapeFactory = {
        createShape: function(shapeRequest) {
            switch(shapeRequest.shapeType) {
                case CSMApi.EnumShape.Waypoint:
                    return new Waypoint(shapeRequest.player, shapeRequest.position, 
                                        shapeRequest.context, shapeRequest.text);
                case CSMApi.EnumShape.Syncpoint:
                    return new Syncpoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
                case CSMApi.EnumShape.Camppoint:
                    return new Camppoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
                case CSMApi.EnumShape.Waitpoint:
                    return new Waitpoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
            }
        }
    };

}(window.CSMApi || (window.CSMApi = {})));
# Data

Below describes the steps taken to gather and generate required data

## Digital elevation model
The digital elevation model was downloaded from the Utah Automated 
Geographic Reference Center [AGRC](https://gis.utah.gov/data/elevation-and-terrain/)
at the 30m resolution for Little Cottonwood Canyon.

## UAC classes
The DEM was categorized with the avalanche rose and given a value 
following the table in the [UAC class document](map/uac_class.txt).

This step was based on classifying the DEM by 
[elevation band](map/elevation_class.txt) and 
[aspect class](map/aspect_class.txt) beforehand.

The raster math given in the descriptions and all other processing steps can 
be executed via command line through [GDAL](https://gdal.org) or through 
a GIS GUI like [QGIS](https://www.qgis.org/en/site/).
Essential GDAL command line option, when generating the final output raster 
is `-co TILED=YES`. This generates a cloud optimized GeoTiff that speeds up
loading and display of data.
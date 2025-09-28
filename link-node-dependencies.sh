#!/bin/sh

# Creates links to all required dependencies, so that they become available to Hugo.
# Defined dependencies from below will get linked to $link_dir

link_dir="assets/node"

# Define dependencies
set -- \
    node_modules/bootstrap/dist/js/bootstrap.bundle.min.js \
    node_modules/bootstrap/dist/css/bootstrap.min.css \
    node_modules/owl-carousel-legacy/owl.carousel.min.js \
    node_modules/owl-carousel-legacy/css/owl.carousel.css \
    node_modules/animate.css/animate.min.css \
    node_modules/jquery/dist/jquery.min.js \
    node_modules/jquery.cookie/jquery.cookie.js \
    node_modules/jquery-waypoints/waypoints.min.js \
    node_modules/jquery.counterup/jquery.counterup.min.js \
    node_modules/masonry-layout/dist/masonry.pkgd.min.js

# Clear previous links and make sure link directory exists
rm -Rf "$link_dir" && mkdir -p "$link_dir"

for path in "$@"; do
    filename=$(basename "$path")
    link "$path" "$link_dir"/"$filename"
done

window.selectionSync = new SelectionSync();

new AreaMap(selectionSync).then(function() {
    new Rose(selectionSync).draw();
    new Calendar(selectionSync).show();
});

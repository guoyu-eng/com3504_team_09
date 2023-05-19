$("#unknownTick").change(function() {
    if(this.checked) {
        $("#name").val("Unknown");
        $("#name").attr("readonly", true);
    }
    else {
        $("#name").val("");
        $("#name").attr("readonly", false);
    }
});
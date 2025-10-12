$(document).ready(function () {
    // 1. Disable right-click
    $(document).on("contextmenu", function (e) {
        e.preventDefault();
        alert("Right-click is disabled!");
    });

    // 2. Scroll to top when image clicked
    $("#scrollTopImg").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

    // 3. Change paragraph color on mouseover
    $("p").hover(
        function () { $(this).css("color", "red"); },
        function () { $(this).css("color", ""); } // reset on mouseout
    );

    // 4. Show/Hide message on button click
    $("#toggleBtn").click(function () {
        $("#message").toggle();
    });
});
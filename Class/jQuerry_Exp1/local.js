<!DOCTYPE html>
<html>

<head>
    <title>Local jQuery</title>
    <script src="./jquery-3.7.1.min.js"></script>
</head>

<body>
    <h1>Testing Local jQuery</h1>
    <p>time taken is <span id="time">being estimated</span></p>

    <script>
        const start = performance.now();

        $(document).ready(function () {
            const end = performance.now();
            var timeTaken = (end - start).toFixed(2);
            console.log("Local jQuery load time: " + timeTaken + " ms");
            $("#time").html(timeTaken + " ms");
        });
    </script>
</body>

</html>
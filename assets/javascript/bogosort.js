$(document).ready(function() {
    var input = "";
    var itr = 0;
    var reachedTimeout = false;
    document.getElementById("risks").checked = false;
    $("#timeout-box").attr("disabled", "true");

    // The *timeout* variable determines how many times the loop will execute before forcing a stop.
    // The default is 10000000, (ten million), which will allow you to process lists of up to 10 elements the majority of the time.
    // (Lists of up to 10 elements might still fail; Bogosort is random, after all).

    // Adjusting *timeout* will allow you to process larger lists, but the runtime
    // might become stupidly long, which can gobble up your system resources
    // or even crash the browser. Tinker at your own risk.
    var timeout = document.getElementById("the-form").elements[1].value;

    $("#sub").click(function() {
        $("#sub").attr("disabled", "true");
        var x = document.getElementById("the-form");
        timeout = parseInt(x.elements[1].value);
        var t0 = performance.now();
        input = x.elements[0].value;;
        var split = input.split(",");
        var arrToSort = [];
        var valid = true;
        if(isNaN(timeout)) {
            valid = false;
        }
        for(var i = 0; i < split.length; i++) {
            var nextNum = parseInt(split[i]);
            if(isNaN(nextNum)) {
                valid = false;
                break;
            } else {
                arrToSort.push(nextNum);
            }
        }
        $("#status").css("font-weight", "bold");
        if(valid) {
            bogosort(arrToSort);
            var t1 = performance.now();
            var timeTaken = ((t1 - t0)/1000);
            $("#original-list").text("Original List: " + document.getElementById("the-form").elements[0].value);
            $("#status").css("color", "black");
            $("#time").css("color", "black");
            $("#time").css("font-weight", "normal");

            if(checkSorted(arrToSort)) {
                $("#sorted-list").text("Sorted List: " + arrToSort.toString());
                $("#status").text("Success! To sort your list, Bogosort looped " + itr + " times!");
                if(timeTaken > 5) {
                    $("#time").text("That amount of looping took " + timeTaken + " seconds! That's really bad!");
                } else if(timeTaken > 2.5){
                    $("#time").text("That amount of looping took " + timeTaken + " seconds! That's pretty bad!");
                } else {
                    $("#time").text("That amount of looping took " + timeTaken + " seconds! That's reasonable, I guess...");
                }
            } else {
                $("#sorted-list").text("Failed to sort the list");
                if(reachedTimeout) {
                    $("#status").text("The attempt to sort the list timed out at " + itr + " loops due to a hard cap on the number of allowed loops.");
                    $("#time").text("That amount of looping took " + timeTaken + " seconds!");
                } else {
                    $("#status").text("The attempt to sort the list timed out at " + itr + " loops due to exceptionally below-average runtime.");
                    $("#time").text("That amount of looping took " + timeTaken + " seconds!");
                }
            }
        } else {
            $("#original-list").text("");
            $("#sorted-list").text("");
            $("#status").text("List may not be valid. Please enter a comma'd list of numbers. (eg. 12, 4, 35)");
            $("#time").text("Timout may not be valid. Please enter an integer.");
            $("#status").css("color", "darkred");
            $("#time").css("color", "darkred");
            $("#time").css("font-weight", "bold");
        }
        reachedTimeout = false;
        itr = 0;
        $("#sub").removeAttr("disabled");
    });

    // A horrible sorting algorithm. Randomly shuffles the passed in array and checks if it's sorted.
    // Effectively equivalent to throwing a bunch of cards on the floor, picking them up, and hoping the deck is sorted.
    // Obscenely slow, but fun to mess around with.
    // This implementation of Bogosort automatically breaks out if it continues for too long relative to the length of the array.
    // It also automatically breaks out if the runtime is arbitrarily high, as defined by the timeout variable.
    function bogosort(arr) {
        var clone = cloneArray(arr);
        var indexList = getIndices(arr);
        while(!checkSorted(arr) && itr < factorial((arr.length + 1)) && itr < timeout) {
            var indicesAvailable = cloneArray(indexList);
            for(var i = 0; i < arr.length; i++) {
                var randomIndex = indicesAvailable[Math.floor(Math.random() * indicesAvailable.length)];
                arr[randomIndex] = clone[i];
                indicesAvailable.splice(indicesAvailable.indexOf(randomIndex), 1);
            }
            itr++;
        }
        if(itr === timeout) {
            reachedTimeout = true;
        }
    }

    // Returns a copy of the parameter array
    function cloneArray(arr) {
        var clone = [];
        for(var i = 0; i < arr.length; i++) {
            clone.push(arr[i]);
        }
        return clone;
    }

    // Returns an array of indices of the parameter array
    function getIndices(arr) {
        var indices = [];
        for(var i = 0; i < arr.length; i++) {
            indices.push(i);
        }
        return indices;
    }

    // Checks if an array is in sorted order
    function checkSorted(arr) {
        if(arr.length != 0) {
            var result = true;
            var last = arr[0];
            for(var i = 0; i < arr.length; i++) {
                if(arr[i] < last) {
                    result = false;
                    break;
                }
                last = arr[i];
            }
            return result;
        }
        return true;
    }

    // Returns the factorial of the parameter number.
    // Used to define a runtime limit. Bogosort runtime is atrocious and random, so ending execution after long enough is useful.
    function factorial(x) { 
        if (x === 0) {
            return 1;
        }
        return x * factorial(x-1);
    }

    // Allows the user to set the timout variable themselves at the page level.
    $("#risks").click(function() {  
        var timeoutBox = $("#timeout-box");
        var val = $("#risks");
        if ($(val).attr("value") === "checked") {
            $(timeoutBox).attr("disabled", "true");
            $(val).attr("value", "unchecked");
        } else {
            $(timeoutBox).removeAttr("disabled");
            $(val).attr("value", "checked");
        }
    }); 
});
// Variable declaration

var animals = ['cat', 'dog', 'fish', 'bird', 'rat', 'hamster', 'chinchilla', 'horse', 'lizard','bear','tiger','mountain lion','fox'],
    btnColors = ['primary','success','info','warning','danger'];
    btns = $('#buttons'),
    gifs = $('#gifs'),
    main = $('body'),
    giphyToken = 'rJt32RsvjUdHPIBRNZadxmdnnsGuvEMh';


// Button generation
function buttonGen () {
    for (i=0;i<animals.length;i++) {

        // Create new button
        var animalBtn = $('<button>');

        // Assign random color to button
        var random = Math.floor(Math.random() * btnColors.length);
        animalBtn.addClass('animal-btn btn btn-'+btnColors[random]);

        // Assign data variable
        animalBtn.attr('data-animal', animals[i]);

        // Assign button text
        animalBtn.text(animals[i]);

        // Append to #buttons div
        btns.append(animalBtn);
    }
}

// Initial button generation
buttonGen();

// When animal button clicked
$(main).on('click', '.animal-btn', function() {
    // Query GIPHY API
    var query = $(this).attr('data-animal');
    $.ajax({url:'https://api.giphy.com/v1/gifs/search?q='+query+'&limit=10&api_key='+giphyToken, method: 'GET'})
        .done(function(response){
            console.log(response);
            for(i=0;i<10;i++) {
                // Create outer div, image, and rating div
                var newBox = $('<div class="wf-box">'),
                    newContent = $('<div class="content">'),
                    newImg = $('<img class="gif">'),
                    newH3 = $('<h3>');

                // Hierarchy adjustments
                newBox.append(newContent);
                newContent.append(newImg, newH3);

                // Set image source and id
                newImg.attr({'src': response.data[i].images.original_still.url, 'id': response.data[i].id, 'data-play':'false'});

                // Add default text to H3
                newH3.text('Rating: '+ response.data[i].rating.toUpperCase());

                // Append to images area
                gifs.append(newBox);
            }

            // Activate waterfall layout
            // use querySelector/querySelectorAll internally
            var waterfall = new Waterfall({ 
                containerSelector: '.wf-container',
                boxSelector: '.wf-box',
                minBoxWidth: 250
            });

        });
});

// When thumbnail clicked
$(main).on('click', '.gif', function() {
    var play = $(this).attr('data-play');
    var id = $(this).attr('id');
    
    if (play == 'false') {
    // Change from thumb to gif
        $(this).attr('src', 'https://media0.giphy.com/media/'+id+'/giphy.gif');
        $(this).attr('data-play', 'true');
    }
    else if (play == 'true') {
    // Change from gif to thumb
        $(this).attr('src', 'https://media0.giphy.com/media/'+id+'/giphy_s.gif');
        $(this).attr('data-play', 'false');
    }
});

// When "Add Animal" button clicked
$(main).on('click', '#add-animal', function() {

    // Assign text box value to variable
    var newAnimal = $('#new-animal').val().trim();
    console.log(newAnimal);

    // Add new animal to animals array
    animals.push(newAnimal);
    console.log(animals);

    // Clear text box
    $('#new-animal').val('');

    // Clear previous buttons
    $('#buttons').empty();

    // Generate new buttons
    buttonGen();
});
// Variable declaration

var animals = ['cat', 'dog', 'fish', 'bird', 'rat', 'hamster', 'chinchilla', 'horse', 'lizard','bear','tiger','mountain lion','fox'],
    btnColors = ['primary','success','info','warning','danger'];
    btns = $('#buttons'),
    gifs = $('#gifs'),
    main = $('body'),
    offset = 0,
    query = '';
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

// Query GIPHY API
function giphyAPI() {
    $.ajax({url:'https://api.giphy.com/v1/gifs/search?q='+query+'&limit=10&offset='+offset+'&api_key='+giphyToken, method: 'GET'})
        .done(function(response){
            console.log(response);
            for(i=0;i<10;i++) {
                // Create outer div, image, and rating div
                var newBox = $('<div class="wf-box">'),
                    newContent = $('<div class="content">'),
                    newGif = $('<video class="gif">'),
                    newDL = $('<img src="assets/images/download.png" class="download">'),
                    // newLink = $('<a href="'+response.data[i].images.original.url+'">'),
                    newLink = $('<a href="https://i.giphy.com/'+response.data[i].id+'.gif">'),
                    newH3 = $('<h3>');

                // Hierarchy adjustments
                newBox.append(newContent);
                newLink.append(newDL);
                newContent.append(newGif, newLink, newH3);

                // Set image source and id
                newGif.attr({'src': response.data[i].images.looping.mp4, 'id': response.data[i].id, 'data-play':'false'});

                // Add rating text to H3
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

            // Show more button
            $('#btn-holder').css('display', 'block');
        });
}

// When animal button clicked
$(main).on('click', '.animal-btn', function() {
    // Clear any old gifs
    $('#gifs').html('<div id="btn-holder"><img src="assets/images/more.png" id="btn-more"></div>');

    // Set query
    query = $(this).attr('data-animal');

    // Ajax call to API
    giphyAPI();

    // Add more button spacer
    $('#left-col').append('<div id="btn-spacer"></div>');

    // Add to offset
    offset += 10;

    // Petfinder visibility
    if (query == 'dog' || query == 'cat' || query == 'horse' || query == 'bird') {
        $('#adoptable').css('display','block');
        $('#adoptable-text').html('Adoptable '+query+'s in your area:');
    }
    else {
        $('#adoptable').css('display','none');
    }

    // Clear Petfinder results
    $('#pets').empty();
    
});

// When thumbnail clicked
$(main).on('click', '.gif', function() {
    var play = $(this).attr('data-play');
    var id = $(this).attr('id');
    
    if (play == 'false') {
    // Change from thumb to gif
        $(this).trigger('play');
        $(this).attr('data-play', 'true');
    }
    else if (play == 'true') {
    // Change from gif to thumb
        $(this).trigger('pause');
        $(this).attr('data-play', 'false');
    }
});

// When more button clicked
$(main).on('click', '#btn-more', function(){

    // Query GIPHY
    giphyAPI();

    // // Scroll to bottom of window
    // var interval = setInterval(scroll, 1000);
    // var scrollY = window.pageYOffset;
    // console.log(scrollY);
    // function scroll() {
    //     if (scrollY == 0) {
    //         clearInterval(interval);
    //         window.scrollTo(0,document.body.scrollHeight);
    //     } else {
    //     window.scrollTo(0,document.body.scrollHeight);
    //     }
    // }

    // Add to offset
    offset += 10;
});

// Show download button
$(main).on('mouseover','.content', function (){
    $(this).find(".download").css('opacity','0.8');
});

// Hide download button
$(main).on('mouseout','.content', function (){
    $(this).find(".download").css('opacity','0');
});

// When "Add Animal" button clicked
$(main).on('click', '#add-animal', function() {

    // Assign text box value to variable
    var newAnimal = $('#new-animal').val().trim();

    // Add new animal to animals array
    animals.push(newAnimal);

    // Clear text box
    $('#new-animal').val('');

    // Clear previous buttons
    $('#buttons').empty();

    // Generate new buttons
    buttonGen();
});

// Petfinder query
$(main).on('click','#btn-zip', function () {

    // Save user zip code
    var zip = $('#zip').val().trim();

    // Query PetFinder
    $.getJSON('http://api.petfinder.com/pet.find?key=77eb2568edd983423bde81c1110a0a7d&animal='+query+'&location='+zip+'&format=json&count=2&callback=?')
    .done(function(response) { 
            console.log(response); 
            var id = '',
                name = '',
                photo = '', 
                city = '',
                state = '',
                array = response.petfinder.pets.pet;
            for(i=0;i<array.length;i++) {
                // Assign response values to variables
                id = response.petfinder.pets.pet[i].id.$t;
                name = response.petfinder.pets.pet[i].name.$t;
                photo = response.petfinder.pets.pet[i].media.photos.photo[2].$t;
                city = response.petfinder.pets.pet[i].contact.city.$t;
                state = response.petfinder.pets.pet[i].contact.state.$t;
                console.log(id, name, photo, city, state);

                // Create base layout
                var newId = $('<a href="https://www.petfinder.com/petdetail/'+id+'">'),
                    newName = $('<p class="adopt-name">'),
                    newPhoto = $('<img src="'+photo+'">'),
                    newLocation = $('<p>'),
                    newContainer = $('<div class="adopt-container">');
                
                // Add values to new elements
                newName.append(name);
                newLocation.append(city+', '+state);

                // Hierarchy adjustments
                newContainer.append(newName,newPhoto,newLocation);
                newId.append(newContainer);

                // Place in layout
                $('#pets').append(newId);
            }
        })
    .fail(function(err) {console.log(err);}); 
});




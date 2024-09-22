function startHere(){
    // alert('from JS here')

    var fname = document.getElementById('fname').value
    var lname = document.getElementById('lname').value
    var gmail = document.getElementById('gmail').value
    var age = document.getElementById('age').value
    var gender = document.getElementById('gender').value
    var profession = document.getElementById('profession').value
    var city = document.getElementById('city').value
    var state = document.getElementById('state').value
    var country = document.getElementById('country').value
    var zip = document.getElementById('zip').value
    alert("Your Name is " + fname + " " + lname + "\nYour Gmail " + gmail + "\nYou are " + age + " years old " + "\nYou are a " + gender + "\nYou are a " + profession + "\nYou live in " + city + "\nYou live in " + state + "\nYou live in " + country + "\nYour Zip Code is " + zip)
}


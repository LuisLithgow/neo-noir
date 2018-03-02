
$(document).ready(function() {
    
    $('.deleteUser').on('click', deleteUser);
});


function deleteUser() {
    // event.preventDefault();
    console.log("clicked");
    let confirmation = confirm('Are you sure you want to delete?');

    if(confirmation) {
        $.ajax({
            type:'DELETE',
            url:'users/delete/'+$(this).data('id')
        }).done(function(response){
            window.location.replace('/');
        });
        window.location.replace('/');
    }else {
        return false;
    }
}






 









var tbody = document.getElementsByTagName('tbody')[0];
var price = 0;
// loop through the tr to add an event listener to every x image
for(let tr of tbody.getElementsByTagName('tr'))
{
  let img;
  img = tr.getElementsByTagName("img");
  img[0].addEventListener('click',function()
  {
    img[0].parentNode.parentNode.remove();

    // assign the price to zero to recalculate the value of Moyennes
    price = 0;
    // loop through the table elements prices and get the moyenne
    for(var i = 0; i < tbody.getElementsByTagName('tr').length + 1 ; i++)
    {


      if(tbody.getElementsByTagName('tr')[i])
      {
        price += parseInt(tbody.getElementsByTagName('tr')[i].getElementsByTagName('td')[1].innerHTML.replace(/\s/g, ''));
        console.log(price);
      }else{ continue; }
    }
    price = ((price) / (tbody.getElementsByTagName('tr').length));
    price = price.toFixed(2);
    document.getElementById("rms").innerHTML = "Moyenne: " + price +" dh";
  });
}

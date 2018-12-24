
var tbody = document.getElementsByTagName('tbody')[0];

for(let tr of tbody.getElementsByTagName('tr'))
{
  let img = tr.getElementsByTagName("img");
  img[0].addEventListener('click',function()
  {
    img[0].parentNode.parentNode.remove();
  });
  console.log(img);
}

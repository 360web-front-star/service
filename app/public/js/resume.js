var index = 0;
var list = document.getElementsByClassName('item');
var dotList = document.getElementsByClassName('dot');

document.getElementsByTagName('body')[0].addEventListener('mousewheel', function(event){
  if(event.wheelDelta < 0) {
    index = (index + 1) % 4;
  } else {
    index = (index - 1 + 4) % 4;
  }

  changePage();
});

function changePage() {
  for(var i = 0; i < list.length; i++) {
    list[i].className = 'item';
    dotList[i].className = 'dot'
  }

  list[index].className += ' active';
  dotList[index].className += ' dotActive';
}

for(var i = 0; i < dotList.length; i++) {
  dotList[i].onclick = function (num) {
    return function () {
      index = num;
      changePage();
    }
  }(i);
}
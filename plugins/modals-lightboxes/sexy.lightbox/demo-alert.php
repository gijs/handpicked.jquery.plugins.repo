<?PHP
  $color['black']['bg']    = '#000000';
  $color['black']['text']  = '#FFFFFF';
  $color['black']['h3']    = '#999999';

  $color['white']['bg']    = '#FFFFFF';
  $color['white']['text']  = '#000000';
  $color['white']['h3']    = '#8FB325';
?>

<div class="alertbox" style="background-color:<?=$color[$_GET['background']]['bg']?>; color:<?=$color[$_GET['background']]['text']?>">
  <h3 style="color:<?=$color[$_GET['background']]['h3']?>">Do you want uninstall Internet Explorer 6?</h3>
  <p>Just a simple test.</p>

  <p class="buttons">
    <input type="button" value="Yes, Please!" onclick="alert('Sorry I can\'t');"/>
    <input type="button" value="No" onclick="SexyLightbox.close()"/>
  </p>
</div>
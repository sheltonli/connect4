
<!DOCTYPE html>

<html>
	<head>
    <link rel="stylesheet" type="text/css" href="<?= base_url() ?>css/template.css" media="all">
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="<?= base_url() ?>/js/jquery.timers.js"></script>
	<script>

		var otherUser = "<?= $otherUser->login ?>";
		var user = "<?= $user->login ?>";
		var status = "<?= $status ?>";
		var t = 1;
		
		$(function(){
			$('body').everyTime(2000,function(){
					if (status == 'waiting') {
						$.getJSON('<?= base_url() ?>arcade/checkInvitation',function(data, text, jqZHR){
								if (data && data.status=='rejected') {
									alert("Sorry, your invitation to play was declined!");
									window.location.href = '<?= base_url() ?>arcade/index';
								}
								if (data && data.status=='accepted') {
									status = 'playing';
									$('#status').html('Playing ' + otherUser);
								}
								
						});
					}
					$.getJSON("<?= base_url() ?>board/getMsg", function (data,text,jqXHR){
						if (data && data.status=='success') {
							var conversation = $('[name=conversation]').val();
							var msg = data.message;
							if (msg.length > 0)
								$('[name=conversation]').val(conversation + "\n" + otherUser + ": " + msg);
						}
					});

					$.getJSON("<?= base_url() ?>board/getChip/" + t, function (data,text,jqXHR){
						if (data && data.status=='success') {
							var col = data.col;
							t = data.turn;
							if (col != 'NULL')
								addChip(col);
						}
					});
			});

			$('form').submit(function(){
				var arguments = $(this).serialize();
				console.log(arguments);
				var url = "<?= base_url() ?>board/postMsg";
				$.post(url,arguments, function (data,textStatus,jqXHR){
						var conversation = $('[name=conversation]').val();
						var msg = $('[name=msg]').val();
						$('[name=conversation]').val(conversation + "\n" + user + ": " + msg);
						});
				return false;
				});	
		});
	
	</script>
	</head> 
<body>  

<div id="board" scrolling="no">
	<script type ="text/javascript" src="<?= base_url() ?>js/threejs/three.min.js"></script>
        <script type ="text/javascript" src="<?= base_url() ?>js/threejs/OrbitControls.js"></script>
        <script type="text/javascript" src="<?= base_url() ?>js/threejs/Detector.js"></script>
        <script type ="text/javascript" src="<?= base_url() ?>js/board.js"></script>
</div>
	<div id="hello">
	Hello <?= $user->fullName() ?>  <?= anchor('account/logout','(Logout)') ?>  
	</div>
	
	<div id='status'> 
	<?php 
		if ($status == "playing")
			echo "Playing " . $otherUser->login;
		else
			echo "Wating on " . $otherUser->login;
	?>


	</div>

	<?php 
		
		echo form_textarea('conversation');
		
		echo form_open();
		echo form_input('msg');
		echo form_submit('Send','Send');
		echo form_close();
		
	?>
	
</body>

</html>


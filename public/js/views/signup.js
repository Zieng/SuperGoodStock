
$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if( av.validateForm() == false)
				return false;
			else
				return true;
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success')
				$('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h2').text('注册');
	$('#account-form #sub1').text('请填写如下账户信息');
	$('#account-form #sub2').text('请填写用户名和密码');
	$('#account-form-btn1').html('取消');
	$('#account-form-btn2').html('提交');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('账户创建成功!');
	$('.modal-alert .modal-body p').html('您的账户已经创建.</br>点击OK回到登录页面');

});
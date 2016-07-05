
function AccountValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#name-tf'), $('#email-tf'), $('#loginPass-tf'),  $('#loginPass-tf2'), $('#telephone-tf')];
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#loginPass-cg'), $('#telephone-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateName = function(s)
	{
		return s.length >= 3;
	};
	
	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed their password, return ok
		if ($('#userId').val() && s===''){
			return true;
		}	else{
			return s.length >= 6;
		}
	};

	this.validatePassMatch = function (s1, s2) {
		return s1 == s2;
	};
	
	this.validateEmail = function(e)
	{
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
	};

    this.validateTel = function (s) {
        return s.length == 11;
    };
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('请纠正如下错误:');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[1].addClass('error');
	this.showErrors(['That email address is already in use.']);
};

AccountValidator.prototype.showInvalidUserName = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That username is already in use.']);
};

AccountValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++)
		this.controlGroups[i].removeClass('error');
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('请输入用户名');
	}
	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); e.push('请输入合法的邮件地址');
	}
	if (this.validatePassword(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('为了安全,密码至少要6个字符');
	}
	if (this.validatePassMatch(this.formFields[2].val(), this.formFields[3].val()) == false)
	{
		this.controlGroups[2].addClass('error');
		e.push('两次输入密码不符');
	}
    if (this.validateTel(this.formFields[4].val()) == false)
    {
        this.controlGroups[3].addClass('error');
        e.push('请输入11位电话号码格式');
    }
	if (e.length) this.showErrors(e);
	return e.length === 0;
};

	
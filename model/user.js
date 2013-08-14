/**
 * Created with JetBrains WebStorm.
 * User: PASHA
 * Date: 02/08/13
 * Time: 09:50
 * To change this template use File | Settings | File Templates.
 */
var USER=USER ||{}

USER.model=function() {
     var self=this;
    self.userID=ko.observable('');
    self.fname=ko.observable('');
    self.lname=ko.observable('');
    self.email=ko.observable('');
    self.phno=ko.observable('');
    self.fullName=ko.computed(function(){
        return self.fname()+" "+self.lname();
    })
    self.dirtyFlag = new ko.DirtyFlag([
        self.fname,
        self.lname,
        self.email,
        self.phno,
        self.fullName
        ]);
    return self;
};


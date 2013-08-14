/**
 * Created with JetBrains WebStorm.
 * User: PASHA
 * Date: 02/08/13
 * Time: 10:10
 * To change this template use File | Settings | File Templates.
 */
//var USER=USER ||{}
(function(){
   var allUsers=ko.observableArray([]),
       newUser=ko.observable(),
       isAddVisible=ko.observable(false),
       editRecord=ko.observable(),
       tempRecord=ko.observable();

    newUser(new USER.model())
   var storeModel=function(){
       var self=this;
       self.userID='';
       self.fname='';
       self.lname='';
       self.phno='';
       self.email='';
   }

   function mapToStore(userModel){
       var storeMD=new storeModel();
       storeMD.fname=userModel.fname();
       storeMD.lname=userModel.lname();
       storeMD.email=userModel.email();
       storeMD.phno=userModel.phno();
       return storeMD;
   }
   function mapToUser(storeMD){
       userModel=new USER.model();
       userModel.userID(storeMD.userID);
       userModel.fname(storeMD.fname);
       userModel.lname(storeMD.lname);
       userModel.email(storeMD.email);
       userModel.phno(storeMD.phno);
       return userModel;
   }
   function store(data,userid){
     var users= amplify.store("users");
       if(!users)
           users=[]
       var mapped=mapToStore(data);
       console.log(userid);
     if(userid){
         ko.utils.arrayMap(users, function(item) {
         //    console.log(item.userID)
             if(item.userID==userid){
                 console.log(mapped);
                item.fname=mapped.fname;
                item.lname=mapped.lname;
                item.email=mapped.email;
                item.phno=mapped.phno;
                console.log(item);
               return true;
             }
         });

     }
       else{
     var maxIndex= amplify.store("MAXINDEX");
         if(!maxIndex)
         {amplify.store("MAXINDEX",1000);
             maxIndex=1000;}
          maxIndex+=1;
         mapped.userID=maxIndex;
         users.push(mapped);
         amplify.store("MAXINDEX",maxIndex)
         data.userID(maxIndex);
         allUsers.push(data);
     }
       amplify.store("users",users);
   }
    function getAllUsers(){
        var users=amplify.store("users");
        if(users){
            var items=[];
            ko.utils.arrayMap(users, function(item) {
               items.push(mapToUser(item));
            });
            allUsers([])
            allUsers(items);
        }

    }
    function resetForm(){
    newUser().fname('')
             .lname('')
             .phno('')
             .email('');
    }
    function add(){
      isAddVisible(true);
      // var k=new USER.model();
        //console.log(k);
       // alert("in add fun")
    }
    function save(){
     // console.log(newUser);
       isAddVisible(false)
        store(newUser());
        newUser(new USER.model());
        resetForm();
    }
    function cancel(){
        alert("in cancel");
        isAddVisible(false);
        resetForm();
    }
    function setEditContext(data)
    {
        editRecord(data);
        editRecord().dirtyFlag().reset();
        console.log(editRecord());
        var temp=new USER.model();
        temp.userID(data.userID());
        temp.fname(data.fname());
        temp.lname(data.lname());
        temp.phno(data.phno());
        temp.email(data.email())
        tempRecord(temp);
    }
    function saveEdit(){
       var mapped=mapToStore(tempRecord());
          store(editRecord(),editRecord().userID())
        $('#myModal').modal('hide')
    }
    function cancelEdit(){
     ko.utils.arrayFirst(allUsers(),function(item){
          if(item.userID()==tempRecord().userID()){
              console.log(tempRecord())
              alert(tempRecord().email())
             // alert("matched")
              item.fname(tempRecord().fname());
              item.lname(tempRecord().lname());
              item.phno(tempRecord().phno());
              item.email(tempRecord().email());
              return true;
          }
      })

        tempRecord('');
    }

    function deleteRecord(data){
       var users=amplify.store("users")
        var i=0;
        if(users){
            ko.utils.arrayFirst(users,function(item){
              if(data.userID()==item.userID){
                  users.splice(i,1);
                  return true;
              }
                i++;
            })
        }
         allUsers.remove(function(item){
             return item.userID()==data.userID();
         });
        amplify.store("users",users);
    }
    $(function(){
        getAllUsers();
    });
   var vm={
       add:add,
       newUser:newUser,
       save:save,
       cancel:cancel,
       isAddVisible:isAddVisible,
       allUsers:allUsers,
       editRecord:editRecord,
       setEditContext:setEditContext,
       getAllUsers:getAllUsers,
       cancelEdit:cancelEdit,
       saveEdit:saveEdit,
       deleteRecord:deleteRecord

   }
    ko.applyBindings(vm);
})();
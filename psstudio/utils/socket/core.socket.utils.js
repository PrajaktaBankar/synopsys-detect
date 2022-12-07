/**
 * Created by dushyant on 25/5/17.
 */

var _io;

module.exports.init=function(io){
    _io=io;
};

module.exports.emit=function(msg,data,project){
    if(project._id){
        _io.sockets.in(project.createdBy+project._id).emit(msg, data);
    }else{
        _io.sockets.in(project.createdBy).emit(msg, data);
    }
    //_io.emit(msg,data);
};

module.exports.broadcast=function(msg,data){
    _io.emit(msg,data);
};
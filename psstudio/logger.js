/**
 * Created by dushyant on 11/4/16.
 */
const { transports,winston,createLogger } = require('winston');

var logger = createLogger({
    transports: [
        new transports.File({
            filename:'logger.log',
            handleExceptions: true,
            prettyPrint:true
        }),
        //new (winston.transports.DailyRotateFile)({
        //    //name:'infoLogger',
        //    filename: 'logger',
        //    maxFiles:2,
        //    prettyPrint:true,
        //    datePattern:'_yyyy-MM-dd.log'
        //    //,
        //    //level: 'info'
        //}),
        new transports.Console({
            level:'silly',
            handleExceptions: true,
            prettyPrint:true
        })
    ],exitOnError:false
});
logger.debug('Created logger');

module.exports=logger;


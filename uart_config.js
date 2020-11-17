module.exports = function(RED) {


	function uart_configNode(config) {
		RED.nodes.createNode(this,config);
        
        this.slot = config.slot;
        this.port = config.port;
        this.baud_rate = config.baud_rate;
        this.word_length = config.word_length;
        this.parity = config.parity;
        this.stop_bits = config.stop_bits;
		
		var node = this;
		
		node.on('input', function(msg) {
            var _compare = {};
			var globalContext = node.context().global;
			var currentMode = globalContext.get("currentMode");
			var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
                     
            var command = {
                type: "communication_modular_V1_0",
                slot: parseInt(node.slot),
                method: "UART_config",
                port: node.port,
                baud_rate: parseInt(node.baud_rate),
                word_length: parseInt( node.word_length),
                parity:  parseInt(node.parity),
                stop_bits:  parseInt(node.stop_bits),
                compare: _compare,
                get_output: {}
            };

           
			if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                }
            }
			globalContext.set("exportFile", file);
			console.log(command)
			node.send(msg);
		});
	}
	RED.nodes.registerType("uart_config", uart_configNode);
}
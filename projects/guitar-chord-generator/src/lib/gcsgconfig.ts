export class GCSGConfig {
    private config : any;
    
    constructor() {
        this.config = CSGDefaultConfig;
    }

    get getConfig() : any {
        return this.config;
    }

    /**
     * Returns the value, according to the key, of a configuration.
     * @param key The key of the configuration value.
     */
    public getConfigValue( key : string ) : any {
        
        if( key==undefined || key==null ) {
            return null;
        }
        
        let tokens : Array<string> = key.split(".");

        if( tokens.length < 1 ) {
            return null;
        }

        return this.parseConfig(tokens, 0, this.config)[tokens[tokens.length-1]];
    }

    /**
     * Sets the configuration value according to a key.
     * @param key The key of the configuration.
     * @param value The value for the configuration.
     */
    public setConfig( key : string, value : any ) : void {
        if( key==undefined || key==null ) {
            return null;
        }
        
        let tokens : Array<string> = key.split(".");

        if( tokens.length < 1 ) {
            return null;
        }

        let k : any = this.parseConfig(tokens, 0, this.config);
        if( k!=null) {
            k[tokens[tokens.length-1]] = value;
        }
    }

    /**
     * Recursive method to parse the configuration.
     * @param keyList The list of keys of the current object/element.
     * @param index The current index within the key list.
     * @param config The configuration object.
     */
    private parseConfig( keyList : Array<string>, index : number, config : any ) : any {

        if( index==keyList.length-2 && config[keyList[index]].hasOwnProperty(keyList[index+1])) {
            return config[keyList[index]];
        }

        if( index < keyList.length && config.hasOwnProperty(keyList[index])) {    
            return this.parseConfig( keyList, index+1, config[keyList[index]]);
        }

        return null;
    }
    
    /**
     * Loads configuration form the configuration object.
     * @param config The configuration object.
     */
    public loadConfig( config : any ) : void {
        if( config==null || config==undefined ) {
            this.config = CSGDefaultConfig;
        }
        else{
            this.checkKeys( config, CSGDefaultConfig );   
        }
    }

    /**
     * Validates the key of the configuration object according to the default configuration.
     * @param obj The configuration object.
     * @param _default The default configuration object.
     */
    public checkKeys( obj : any, _default : any ) : void {
        let mainKeys = Object.keys(_default);
        for(let v of mainKeys) {
            if( !obj.hasOwnProperty(v) ) {
                obj[v] = CSGDefaultConfig[v];
            }
            else {
                this.checkKeys( obj[v], _default[v]);
            }
        }
    }
}

let CSGDefaultConfig : any = {
    "offset": {
        "horizontal": 30,
        "vertical": 30
    },
    "string": {
        "count": 6,
        "labelLocation": 1,
        "tuning": ['e', 'B', 'G', 'D', 'A', 'E']
    },
    "fingerCircle": {
        
    },
    "fret": {
        "minimumFretCount": 3,
        "offset": 7,
        "labelLocation": -1
    },
    "bar": {
        "offset": 7,
        "width": 10
    }
};

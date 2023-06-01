<?php

namespace Models;

use Models\DB;

class posts extends DB {
    public $table;
    function __construct(){
        parent::__construct();
        $this->table = $this->db_connect();
    }

    protected $campos = ['id','userId','title','body', 'updated_at'];

    public $valores = [];

}
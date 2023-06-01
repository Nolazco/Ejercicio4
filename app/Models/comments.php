<?php

namespace Models;

use Models\DB;

class comments extends DB {
    public $table;
    function __construct(){
        parent::__construct();
        $this->table = $this->db_connect();
    }

    protected $campos = ['postId','name','email','comment'];

    public $valores = [];

}
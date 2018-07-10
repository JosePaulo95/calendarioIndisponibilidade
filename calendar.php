<?php
/**
*@author  Xu Ding
*@email   thedilab@gmail.com
*@website http://www.StarTutorial.com
**/
class Calendar {  
     
    /**
     * Constructor
     */
    public function __construct(){     
        $this->naviHref = htmlentities($_SERVER['PHP_SELF']);
    }
     
    /********************* PROPERTY ********************/  
    private $dayLabels = array("Seg","Ter","Qua","Qui","Sex","Sáb","Dom");

    private $monthLabels = array("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez");
     
    private $currentYear=0;
     
    private $currentMonth=0;
     
    private $currentDay=0;
     
    private $currentDate=null;
     
    private $daysInMonth=0;
     
    private $naviHref= null;
    
    private $dias_indisponiveis = [];//array("2018-06-10", "2018-07-04");

    /********************* PUBLIC **********************/  
        
    /**
    * print out the calendar
    */
    public function show() {
        $m = date('m');
        $y = date('y');

        $calendars = $this->_geraCalendario($m, $y, 0);

        for ($i=1; $i<12; $i++) { 
            $m++;
            if($m > 12){
                $m = 1;
                $y++;
            }
            $this->_reinicializaAtb();
            $calendars .= $this->_geraCalendario($m, $y, $i);   
        }

        return $calendars;
    }
    private function _reinicializaAtb(){
        $this->currentYear=0;
        $this->currentMonth=0;
        $this->currentDay=0;
        $this->currentDate=null;
        $this->daysInMonth=0;
        $this->naviHref= null;        
    }
    private function _geraCalendario($month, $year, $id){
        $this->currentYear=$year;
         
        $this->currentMonth=$month;
         
        $this->daysInMonth=$this->_daysInMonth($month,$year);  
         
        $display = $id>0?'style= "display: none;"':'style= "display: block;"';

        $content='<div id="calendar'.$id.'" '.$display.'>
                    <div id="calendar">'.
                        '<div class="box">'.
                        $this->_createNavi($id).
                        '</div>'.
                        '<div class="box-content">'.
                                '<ul class="label">'.$this->_createLabels($month, $year).'</ul>';   
                                $content.='<div class="clear"></div>';     
                                $content.='<ul class="dates">';    
                                 
                                $weeksInMonth = $this->_weeksInMonth($month,$year);
                                // Create weeks in a month
                                for( $i=0; $i<$weeksInMonth; $i++ ){    
                                    //Create days in a week
                                    for($j=0;$j<=7;$j++){
                                        if($j==0){
                                            $content.=$this->_showDay2($i, $month, $year);
                                        }else{
                                            $content.=$this->_showDay($i*7+$j);
                                        }
                                    }
                                }
                                
                                $content.='</ul>';
                                 
                                $content.='<div class="clear"></div>';     
             
                        $content.='</div>';
                 
        $content.='
                    </div>
                </div>
                ';
        return $content;

    }
    /********************* PRIVATE **********************/ 
    /**
    * create the li element for ul
    */
    private function _showDay2($index_semana, $month, $year){
        return '<a 
                    style="cursor: pointer;"
                    onmousedown = "marcarSemana(\''.$index_semana.'\',\''.$month.'\',\''.$year.'\');"
                >
                    <li
                        style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" 
                        unselectable="on"
                        onselectstart="return false;" 
                        onmousedown="return false;"
                        id="week-'.$this->currentDate.'"
                        class="remove"
                    >
                        >
                    </li>
                </a>';
    }
    private function _showDay($cellNumber){
         
        if($this->currentDay==0){
             
            $firstDayOfTheWeek = date('N',strtotime($this->currentYear.'-'.$this->currentMonth.'-01'));
                     
            if(intval($cellNumber) == intval($firstDayOfTheWeek)){
                 
                $this->currentDay=1;
                 
            }
        }
         
        if( ($this->currentDay!=0)&&($this->currentDay<=$this->daysInMonth) ){
             
            $this->currentDate = date('Y-m-d',strtotime($this->currentYear.'-'.$this->currentMonth.'-'.($this->currentDay)));
             
            $cellContent = $this->currentDay;
             
            $this->currentDay++;   
             
        }else{
             
            $this->currentDate = null;
 
            $cellContent = null;
        }
             
         //onmouseover = "marcarDia(\''.$this->currentDate.'\'); return false;"
        return '<a 
                    style="cursor: pointer;"
                    onmousedown = "marcarDiaClick(\''.$this->currentDate.'\'); return false;"
                >
                    <li
                        style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" 
                        unselectable="on"
                        onselectstart="return false;" 
                        onmousedown="return false;"
                        id="'.$this->currentDate.'"
                        class="'.$this->_classDiaIndisponivel($this->currentDate).'"
                    >
                        '.$cellContent.'
                    </li>
                </a>';
    }
    private function _classDiaIndisponivel($data){
        if($this->_ehDiaIndisponivel($data)){
            return "indisponivel";
        }
    }
    private function _ehDiaIndisponivel($data){
        return in_array($data, $this->dias_indisponiveis);
    }
    /**
    * create navigation
    */
    private function _createNavi($id){

        $id_atual = $id;
        $prox_id = $id+1;
        $prev_id = $id-1;
         
        $nextMonth = $this->currentMonth==12?1:intval($this->currentMonth)+1;
         
        $nextYear = $this->currentMonth==12?intval($this->currentYear)+1:$this->currentYear;
         
        $preMonth = $this->currentMonth==1?12:intval($this->currentMonth)-1;
         
        $preYear = $this->currentMonth==1?intval($this->currentYear)-1:$this->currentYear;
        
        return
            '<div class="header">'.
                '<a class="prev" href="#" onclick="changeMonth('."'calendar".$id_atual."'".','."'calendar".$prev_id."'".'); return false;">Anterior</a>'.
                    '<span class="title">'.date('Y',strtotime($this->currentYear.'-'.$this->currentMonth.'-1')).' '.$this->monthLabels[$this->currentMonth-1].'</span>'.
                '<a class="next" href="#" onclick="changeMonth('."'calendar".$id_atual."'".','."'calendar".$prox_id."'".'); return false;">Próximo</a>'.
            '</div>';
        /*
        return
            '<div class="header">'.
                '<a class="prev" href="'.$this->naviHref.'?month='.sprintf('%02d',$preMonth).'&year='.$preYear.'">Prev</a>'.
                    '<span class="title">'.date('Y M',strtotime($this->currentYear.'-'.$this->currentMonth.'-1')).'</span>'.
                '<a class="next" href="'.$this->naviHref.'?month='.sprintf("%02d", $nextMonth).'&year='.$nextYear.'">Next</a>'.
            '</div>';
        */
    }
         
    /**
    * create calendar week labels
    */
    private function _createLabels($month, $year){      
        $content='';
        //1o dia vazio
        $content.='
                <li 
                    unselectable="on"
                >
                    
                </li>
            ';
        foreach($this->dayLabels as $index=>$label){
             
            $content.='
                <a
                    style="cursor: pointer;"
                    onmousedown = "marcarDiaSemana(\''.$index.'\', \''.$month.'\', \''.$year.'\');"
                >
                    <li 
                    style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" 
                    unselectable="on"
                    class="'.($label==6?'end':'start').' title bt-dia-semana">
                        '.$label.'<img src="seta-esquerda.svg" style = "width:20px; height:15px;  transform: rotate(90deg); "/>
                    </li>
                <a>
            ';
 
        }
         
        return $content;
    }
     
     
     
    /**
    * calculate number of weeks in a particular month
    */
    private function _weeksInMonth($month=null,$year=null){
         
        if( null==($year) ) {
            $year =  date("Y",time()); 
        }
         
        if(null==($month)) {
            $month = date("m",time());
        }
         
        // find number of days in this month
        $daysInMonths = $this->_daysInMonth($month,$year);
         
        $numOfweeks = ($daysInMonths%7==0?0:1) + intval($daysInMonths/7);
         
        $monthEndingDay= date('N',strtotime($year.'-'.$month.'-'.$daysInMonths));
         
        $monthStartDay = date('N',strtotime($year.'-'.$month.'-01'));
         
        if($monthEndingDay<$monthStartDay){
             
            $numOfweeks++;
         
        }
         
        return $numOfweeks;
    }
 
    /**
    * calculate number of days in a particular month
    */
    private function _daysInMonth($month=null,$year=null){
         
        if(null==($year))
            $year =  date("Y",time()); 
 
        if(null==($month))
            $month = date("m",time());
             
        return date('t',strtotime($year.'-'.$month.'-01'));
    }
     
}

//formulario pra Andrea contas a receber
<template>
  <div class="main">
    <h2>诡影寻踪 网页助手 v1.0</h2>
    <div class="main_content">
      <el-card class="col1" shadow="never">
        <el-card class="canvas_card" shadow="never">
            <canvas height="520" id="canvas" style="display: block;" width="570"
                    @click="handleMapClick">
              你的浏览器居然不支持Canvas？！赶快换一个吧！！
            </canvas>
        </el-card>
        <el-card shadow="never">
          <el-row :gutter="12" type="flex" justify="center" align="middle">
            <el-col :span="8">
              尺寸调节：
            </el-col>
            <el-col :span="16">
              <el-slider
                  v-model="r"
                  :min="10"
                  :max="50"
                  @change="handleRChange">
              </el-slider>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never">
          <el-row :gutter="12" type="flex" justify="center" align="middle">
            <el-col :span="12">
              <el-radio-group v-model="mode" size="small" type="vertical">
                <el-radio :label="0">添加/移除遮蔽</el-radio>
                <el-radio :label="1">添加/移除小屋</el-radio>
                <el-radio :label="2">添加/移除石柱</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="4">
              <el-select v-model="chosenColor" placeholder="请选择" popper-class="colorOptionsContent">
                <el-option
                    v-for="item in colorOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :style="'background:'+ item.value+'; color: '+ item.font_color +'; width:100%; height:100%;'">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button @click="handleManualConfig">
                {{ this.manual_config_tip }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never">
          <el-row :gutter="12">
            <el-col :span="8">
              神秘代码：
            </el-col>
            <el-col :span="16">
              <el-input style="alignment: left" v-model="generatedCode" type="text" size="small" placeholder="请输入内容"
                        @input="handleCodeInputChange"></el-input>
            </el-col>
          </el-row>
        </el-card>

      </el-card>
      <el-card class="clue_table" shadow="never" v-if="!this.manual_config_mode">
        <h4>
          线索对照表
        </h4>
        <el-table
            :data="clueData"
            style="width: 100%"
            ref="clue_table"
            :row-style="{height: '0'}">
          <el-table-column
              prop="clue"
              label="线索"
              width="240"
              fixed
          >
          </el-table-column>
          <el-table-column label="yourself">
            <template slot-scope="scope">
              <el-button
                  class="checklist_button"
                  size="small"
                  :type=clue_state_list[scope.$index][0].type
                  @click="handleClueStateChange(scope.$index, 0)">{{ clue_state_list[scope.$index][0].label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="player2">
            <template slot-scope="scope">
              <el-button
                  class="checklist_button"
                  size="small"
                  :type=clue_state_list[scope.$index][1].type
                  @click="handleClueStateChange(scope.$index, 1)">{{ clue_state_list[scope.$index][1].label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="player3">
            <template slot-scope="scope">
              <el-button
                  class="checklist_button"
                  size="small"
                  :type=clue_state_list[scope.$index][2].type
                  @click="handleClueStateChange(scope.$index, 2)">{{ clue_state_list[scope.$index][2].label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="player4">
            <template slot-scope="scope">
              <el-button
                  class="checklist_button"
                  size="small"
                  :type=clue_state_list[scope.$index][3].type
                  @click="handleClueStateChange(scope.$index, 3)">{{ clue_state_list[scope.$index][3].label }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="player5">
            <template slot-scope="scope">
              <el-button
                  class="checklist_button"
                  size="small"
                  :type=clue_state_list[scope.$index][4].type
                  @click="handleClueStateChange(scope.$index, 4)">{{ clue_state_list[scope.$index][4].label }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="tile_arrangement" shadow="never" v-if="this.manual_config_mode">
        <el-row>
          <h4>
            Tips:拖动以调整排列，点击以旋转板块
          </h4>
        </el-row>
        <el-col :span="12" class="draglist1">
          <draggable @end="handleDragEnd" group="map_tile">
            <el-card style="margin: 20px;font-size: 60px" shadow="never" v-for='i in tile_list1' :key='i.id'
                     class='dragItem'><i class="el-icon-refresh" @click="handleDragClick">{{ i.label }}</i></el-card>
          </draggable>
        </el-col>
        <el-col :span="12" class="draglist2">
          <draggable @end="handleDragEnd" group="map_tile">
            <el-card style="margin: 20px;font-size: 60px" shadow="never" v-for='i in tile_list2' :key='i.id'
                     class='dragItem'><i class="el-icon-refresh" @click="handleDragClick">{{ i.label }}</i></el-card>
          </draggable>
        </el-col>
      </el-card>
    </div>
  </div>
</template>

<script>
import {BEAR, CLUE_DATA, COLOR_MAP, COUGAR, MAP, DIRECTION_EVEN, DIRECTION_ODD, COLOR_SHORT_MAP, INIT_BOARD_STATE} from "@/assets/constants"
import draggable from 'vuedraggable'

const LZ = require("lz-string")

export default {
  name: "Cryptid",
  components: {
    draggable,
  },
  watch: {
    clueData() {
      this.doLayout();
    }
  },
  mounted() {
    this.initCanvas();
    this.initClue();
  },
  data: function () {
    return {
      a: 2 * Math.PI / 6,
      map_width: 12,
      map_height: 9,
      tile_width: 6,
      tile_height: 3,
      r: 30,
      map_detail: [],
      Point: function (x, y) {
        this.x = x;
        this.y = y;
      },
      board_tile_state: [],
      // randomIndexArray: [0, 1, 2, 3, 4, 5],
      // randomBoolArray: [false, false, false, false, false, false],
      clueData: [],
      mode: 0,
      clue_state_list: [],
      click_x: 0,
      click_y: 0,
      generatedCode: "",
      manual_config_tip: "展开手动布局",
      manual_config_mode: false,
      chosenColor: "#009A00",
      colorOption: [
        {
          "label": "green",
          "font_color": "white",
          "value": "#009A00"
        },
        {
          "label": "blue",
          "font_color": "white",
          "value": "#3232E8"
        },
        {
          "label": "black",
          "font_color": "white",
          "value": "#000012"
        },
        {
          "label": "white",
          "font_color": "black",
          "value": "#FFFFFF"
        }
      ],
      tile_list1: [
        {
          id: 0,
          label: "1"
        },
        {
          id: 2,
          label: "3"
        },
        {
          id: 4,
          label: "5"
        },
      ],
      tile_list2: [
        {
          id: 1,
          label: "2"
        },
        {
          id: 3,
          label: "4"
        },
        {
          id: 5,
          label: "6"
        },
      ],
      ownClue: null,
      hut_info: [],
      stone_info: [],
      showPosition: false,
      map: [],
      bear: [],
      cougar: []
    };
  },
  methods: {
    initCanvas() {
      let canvas = document.getElementById('canvas')
      const w=document.documentElement.clientWidth;
      const h=document.documentElement.clientHeight;
      console.log("height:", h, " width:", w);
      if (w>=1000) {
        canvas.height = 520;
        canvas.width = 580;
        let col1_card = document.getElementsByClassName("col1")[0];
        col1_card.style.width = (1.15*canvas.height).toString() + "px";
        this.r = canvas.height / 20;
      } else {
        canvas.height = 0.8*w;
        canvas.width = 0.8*w;
        this.r = canvas.height / 20;
        let clue_table_card = document.getElementsByClassName("clue_table")[0];
        let col1_card = document.getElementsByClassName("col1")[0];
        let canvas_card = document.getElementsByClassName("canvas_card")[0];
        console.log(clue_table_card, col1_card)
        col1_card.style.width = (clue_table_card.style.width).toString() + "px";
        canvas_card.style.height = (1.15*canvas.height).toString() + "px";
      }

      this.ctx = canvas.getContext("2d")

      for (let i = 0; i < this.map_height; i++) {
        this.map_detail[i] = [];
        for (let j = 0; j < this.map_width; j++) {
          this.map_detail[i][j] = 0;
        }
      }

      this.map = JSON.parse(JSON.stringify(MAP))
      this.bear = JSON.parse(JSON.stringify(BEAR))
      this.cougar = JSON.parse(JSON.stringify(COUGAR))
      this.board_tile_state = JSON.parse(JSON.stringify(INIT_BOARD_STATE));
      this.board_tile_state.shuffle();
      this.randomFlip();
      this.generateMap();
    },
    handleMapClick(ev) {
      let x, y;
      if (ev.offsetX || ev.offsetX === 0) {
        x = ev.offsetX;
        y = ev.offsetY;
      }
      const block_info = this.getNearestBlock(x, y);
      let type = "shadow";
      if (this.mode === 0) {
        // console.log("shadow mode")
      }  else if (this.mode === 1) {
        type = "structure";
        // console.log("add hut to map");
        if (this.checkHutExist(block_info["block_x_idx"], block_info["block_y_idx"]) < 0) {
          // console.log("add hut to map");
          this.addToHut(block_info["block_x_idx"], block_info["block_y_idx"], this.chosenColor);
        } else {
          // console.log("remove hut from map");
          this.removeFromHut(block_info["block_x_idx"], block_info["block_y_idx"]);
        }
        // console.log("hut info", this.hut_info)
      } else if (this.mode === 2) {
        type = "structure";
        // console.log("add stone to map");
        if (this.checkStoneExist(block_info["block_x_idx"], block_info["block_y_idx"]) < 0) {
          // console.log("add stone to map");
          this.addToStone(block_info["block_x_idx"], block_info["block_y_idx"], this.chosenColor);
        } else {
          // console.log("remove stone from map");
          this.removeFromStone(block_info["block_x_idx"], block_info["block_y_idx"]);
        }
        // console.log("stone info", this.stone_info)
      }

      const hut_info_id = this.checkHutExist(block_info["block_x_idx"], block_info["block_y_idx"]);
      // console.log("hut exist:", hut_info_id)
      if (hut_info_id >= 0) {
        block_info["hut"] = true;
        block_info["hut_color"] = this.hut_info[hut_info_id]["color"];
      } else {
        block_info["hut"] = false;
      }

      const stone_info_id = this.checkStoneExist(block_info["block_x_idx"], block_info["block_y_idx"]);
      // console.log("stone exist:", stone_info_id)
      if (stone_info_id >= 0) {
        block_info["stone"] = true;
        block_info["stone_color"] = this.stone_info[stone_info_id]["color"];
      } else {
        block_info["stone"] = false;
      }
      // console.log("block_info", block_info)
      this.redraw_block(block_info, type);
    },
    handleCodeInputChange(input) {
      // let complete_code = "NobwRAlgdgJgpgDzALg" + input + "A";
      let complete_code = "N4IglgdgJgpgHiAXAbQ" + input + "AvkA";
      try {
        const json_code = LZ.decompressFromEncodedURIComponent(complete_code);
        const generation_info = JSON.parse(json_code);
        // console.log("board tile info", this.board_tile_state);
        // console.log("code input info", generation_info);
        for (let i=0;i<generation_info["index"].length;i++) {
          this.board_tile_state[i].flip = (generation_info["flip"][i]===1);
          this.board_tile_state[i].index = generation_info["index"][i];
        }
        // console.log("map before", this.map);
        for (let i=0;i<generation_info["flip"].length;i++) {
          if (generation_info["flip"][i]===1) {
            const idx = generation_info["index"][i];
            // console.log("reverse idx:", idx);
            this.map[idx].reverse();
            this.bear[idx].reverse();
            this.cougar[idx].reverse();
          }
        }
        // console.log("map after", this.map);
        this.generateMap();
      } catch (e) {
        // console.log("error", e);
        this.generatedCode = "无法解析神秘代码，请重新输入"
      }
    },
    handleManualConfig() {
      this.manual_config_mode = !this.manual_config_mode;
      // console.log("mode", this.manual_config_mode)
      if (this.manual_config_tip === "展开手动布局") {
        this.manual_config_tip = "展开线索提示";
      } else {
        this.manual_config_tip = "展开手动布局";
      }
      if (this.manual_config_mode) {
        // console.log("manual mode init");
        this.map = JSON.parse(JSON.stringify(MAP))
        this.bear = JSON.parse(JSON.stringify(BEAR))
        this.cougar = JSON.parse(JSON.stringify(COUGAR))
        this.board_tile_state = JSON.parse(JSON.stringify(INIT_BOARD_STATE))
      }
      // console.log("manual state", this.board_tile_state);
      this.generateMap();
    },
    handleDragClick(e) {
      // console.log("tile list 1", this.tile_list1)
      if (this.tile_list1.length !== 3) {
        this.$notify({
          title: '错误',
          message: '请将板块排列成3*2的形状后再旋转',
          duration: 1000
        });
        return;
      }

      const tile_id = parseInt(e.path[0].childNodes[0].data) - 1;
      let tile_loc = 0;
      for (let i=0;i<this.board_tile_state.length;i++) {
        if (this.board_tile_state[i].index === tile_id) {
          tile_loc = i;
          break;
        }
      }
      this.board_tile_state[tile_loc].flip = !this.board_tile_state[tile_loc].flip;
      // console.log("rotate board state")
      this.$notify({
        title: '成功',
        message: '已成功旋转板块' + (tile_id + 1).toString(),
        duration: 1000
      });
      this.map[tile_id].reverse();
      this.bear[tile_id].reverse();
      this.cougar[tile_id].reverse();
      this.generateMap();
    },
    handleDragEnd(e) {
      let old_row = e.oldIndex;
      let new_row = e.newIndex;
      let element = null;
      if (e.from.parentNode.className.indexOf("draglist1") !== -1) {
        element = this.tile_list1[old_row];
        this.tile_list1.splice(old_row, 1);
      } else if (e.from.parentNode.className.indexOf("draglist2") !== -1) {
        element = this.tile_list2[old_row];
        this.tile_list2.splice(old_row, 1);
      }
      if (e.to.parentNode.className.indexOf("draglist1") !== -1) {
        this.tile_list1.splice(new_row, 0, element);
      } else if (e.to.parentNode.className.indexOf("draglist2") !== -1) {
        this.tile_list2.splice(new_row, 0, element);
      }

      // console.log("after drag", this.tile_list1, this.tile_list2)
      if (this.tile_list1.length !== 3) {
        this.$notify({
          title: '错误',
          message: '无法生成地图，请将板块排列成3*2的形状',
          duration: 1000
        });
        return;
      }
      // console.log("index array before", this.randomIndexArray);
      // console.log("flip array before", this.randomBoolArray);
      function get_tile_loc(id, state_list) {
         for (let i in state_list){
           if (id === state_list[i].index) {
             return i;
           }
         }
         return -1;
      }

      // console.log(this.tile_list1, this.tile_list2)
      let state_array = []
      for (let i = 0; i < 3; i++) {
        state_array.push(this.board_tile_state[get_tile_loc(this.tile_list1[i].id, this.board_tile_state)]);
        state_array.push(this.board_tile_state[get_tile_loc(this.tile_list2[i].id, this.board_tile_state)]);
      }
      // console.log("index array", state_array);
      this.board_tile_state = state_array;

      // console.log("index array after", this.randomIndexArray);
      // console.log("flip array after", this.randomBoolArray);

      this.generateMap();
    },
    initClue() {
      this.clueData = [];
      for (const item of CLUE_DATA) {
        if (item.inverse === false) {
          this.clueData.push({
            "clue": item.name
          })
        }
      }
      const len = this.clueData.length;
      for (let i = 0; i < len; i++) {
        this.clue_state_list[i] = [];
        for (let j = 0; j < 5; j++) {
          if (j === 0) {
            this.clue_state_list[i][j] = {label: "No!", type: "danger"};
          } else {
            this.clue_state_list[i][j] = {label: "Maybe", type: ""};
          }
        }
      }
    },
    handleClueStateChange(index, col) {
      if (this.clue_state_list[index][col].label === "Maybe") {
        this.clue_state_list[index][col] = {label: "Inverse", type: "warning"};
      } else if (this.clue_state_list[index][col].label === "Inverse") {
        this.clue_state_list[index][col] = {label: "No!", type: "danger"};
      } else {
        this.clue_state_list[index][col] = {label: "Maybe", type: ""};
      }
      if (col === 0) {
        for (let i = 0; i < this.clue_state_list.length; i++) {
          if (i !== index)
            this.clue_state_list[i][0] = {label: "No!", type: "danger"};
        }
      }

      let maybe_or_inverse_left = 0;
      let last_maybe_index = 0;
      for (let i = 0; i < this.clue_state_list.length; i++) {
        if (this.clue_state_list[i][col].label !== "No!") {
          maybe_or_inverse_left++;
          last_maybe_index = i;
        }
      }
      // console.log(maybe_or_inverse_left)
      if (maybe_or_inverse_left === 1 && this.clue_state_list[last_maybe_index][col].label !== "Inverse") {
        this.clue_state_list[last_maybe_index][col] = {label: "Yes!", type: "success"};
      }
      this.$set(this.clue_state_list, index, this.clue_state_list[index])
      const own_clue = this.clue_state_list.map((item) => {
        return item[0];
      })

      // draw shadow for own clue
      let clue_id = -1;
      for (let idx in own_clue) {
        if (own_clue[idx].label === "Yes!") {
          clue_id = idx;
          break;
        }
      }
      this.ownClue = CLUE_DATA[clue_id];
      if (col === 0) {
        this.generateClueShadow();
      }
    },
    drawDigits() {
      let canvas = document.getElementById('canvas');
      let number_start_y = canvas.height / 6;
      for (let i = 0; i < 3; i++) {
        let number_start_x = canvas.width / 4;
        for (let j = 0; j < 2; j++) {
          const current_number = i * 2 + j;
          this.ctx.font = "60px Arial";
          this.ctx.textAlign = "center";
          this.ctx.fillStyle = "black";
          this.ctx.fillText((this.board_tile_state[current_number].index + 1).toString(), number_start_x, number_start_y);
          // this.ctx.fillText((this.randomIndexArray[current_number] + 1).toString(), number_start_x, number_start_y);
          number_start_x += canvas.width / 2;
        }
        number_start_y += canvas.height / 3
      }
    },
    drawBlockInfo(block_info) {
      this.ctx.font = "15px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      const text = block_info["block_x_idx"].toString() + "," + block_info["block_y_idx"];
      this.ctx.fillText(text, block_info["block_center_x"], block_info["block_center_y"] + this.r/4);
    },
    generateMap() {
      // generate code and compress
      let generation_info = {
        "index": [],
        "flip": [],
      }

      // console.log(this.board_tile_state)
      for (let i=0;i<6;i++) {
        generation_info["index"].push(this.board_tile_state[i].index)
        generation_info["flip"].push(this.board_tile_state[i].flip ? 1 : 0)
      }

      const gen_str = JSON.stringify(generation_info);
      const code = LZ.compressToEncodedURIComponent(gen_str);
      // this.generatedCode = code;
      this.generatedCode = code.slice("N4IglgdgJgpgHiAXAbQ".length, -1)

      let start_y = this.r * Math.sin(this.a);
      for (let i = 0; i < 3; i++) {
        let start_x = this.r;
        for (let j = 0; j < 2; j++) {
          const tile_id = this.board_tile_state[i * 2 + j].index;
          const map_info = {
            "tile_id": tile_id,
            "tile_start_x": j,
            "tile_start_y": i,
            "tile": this.map[tile_id],
            "bear": this.bear[tile_id],
            "cougar": this.cougar[tile_id],
            "flip": this.board_tile_state[i * 2 + j].flip,
          }
          // console.log("map:", tile_id);
          // console.log(MAP[tile_id]);
          this.drawTile(start_x, start_y, map_info);
          start_x += 9 * this.r + 0.25 * this.r;
        }
        start_y += 6 * this.r * Math.sin(this.a) + 0.4 * this.r;
      }
      if (this.manual_config_mode) {
        this.drawDigits();
      }
    },
    drawTile(start_x, start_y, map_info) {
      let x = start_x;
      for (let i = 0; i < this.tile_width; i++) {
        let y = start_y + (i % 2 === 0 ? 0 : this.r * Math.sin(this.a));
        for (let j = 0; j < this.tile_height; j++) {
          const block_id = i * this.tile_height + j;
          let block_info = {
            "tile_id": map_info["tile_id"],
            "block_id": block_id,
            "block_center_x": x,
            "block_center_y": y,
            "block_x_idx": map_info["tile_start_x"] * 6 + i,
            "block_y_idx": map_info["tile_start_y"] * 3 + j,
            "block": map_info["tile"][block_id],
            "bear": map_info["bear"][block_id],
            "cougar": map_info["cougar"][block_id],
            "shadow": false,
            "flip": map_info["flip"],
            "hut": false,
            "hut_color": "black",
            "stone": false,
            "stone_color": "black",
          }

          block_info["block_type"] = ["terrain"]
          if (block_info["bear"] || block_info["cougar"]) {
            block_info["block_type"].push("animal")
          }
          if (block_info["hut"] || block_info["stone"]) {
            block_info["block_type"].push("structure")
          }

          const hut_info_id = this.checkHutExist(block_info["block_x_idx"], block_info["block_y_idx"]);
          if (hut_info_id >= 0) {
            block_info["hut"] = true;
            block_info["hut_color"] = this.hut_info[hut_info_id]["color"];
          }

          const stone_info_id = this.checkStoneExist(block_info["block_x_idx"], block_info["block_y_idx"]);
          if (stone_info_id >= 0) {
            block_info["stone"] = true;
            block_info["stone_color"] = this.stone_info[stone_info_id]["color"];
          }

          this.map_detail[block_info["block_y_idx"]][block_info["block_x_idx"]] = block_info;
          // console.log(x, y, block_info);
          this.drawHexagon(x, y, block_info);
          y += 2 * this.r * Math.sin(this.a);
        }
        x += this.r * (1 + Math.cos(this.a));
      }
    },
    drawHexagon(x, y, block_info) {
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        this.ctx.lineTo(x + this.r * Math.cos(this.a * i), y + this.r * Math.sin(this.a * i));
      }
      this.ctx.closePath();
      this.ctx.setLineDash([])
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "white"
      const block_type = block_info["block"];
      this.ctx.fillStyle = COLOR_MAP[block_type];

      this.ctx.fill();
      this.ctx.stroke();

      // console.log("draw hexagon", block_info);
      this.drawAnimal(block_info);
      this.drawStructure(block_info);
      if (this.showPosition){
        this.drawBlockInfo(block_info);
      }
    },
    getPolygonPoints(centerX, centerY, radius, sides, startAngle) {
      let points = [],
          //这里的angle是基于钟表0点的位置开始计算，0点位置为0度，3点位置为π/2度
          angle = startAngle || 0;

      for (let i = 0; i < sides; ++i) {
        points.push(new this.Point(centerX + radius * Math.sin(angle), centerY + radius * Math.cos(angle)));
        angle += 2 * Math.PI / sides;
      }

      return points;
    },
    createPolygonPath(centerX, centerY, radius, sides, startAngle) {
      let points = this.getPolygonPoints(centerX, centerY, radius, sides, startAngle);

      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < sides; ++i) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.closePath();
    },
    createAnimalRegion(centerX, centerY, color) {
      this.createPolygonPath(centerX, centerY, this.r * 0.8, 6, Math.PI / 6);
      this.ctx.setLineDash([7, 5]);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    },
    createStructureRegion(centerX, centerY, type, color) {
      let edges = 4;
      let start_angle = 0;
      if (type === "stone") {
        edges = 8;
        start_angle = Math.PI / 8;
      } else if (type === "hut") {
        edges = 3;
        start_angle = Math.PI / 3;
      }
      this.createPolygonPath(centerX, centerY, this.r / 2, edges, start_angle);
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.stroke();
    },
    getNearestBlock(x, y) {
      let min_distance = 1e7;
      let result_block = null;
      for (const line of this.map_detail) {
        for (const item of line) {
          const distance = Math.pow(x - item.block_center_x, 2) + Math.pow(y - item.block_center_y, 2)
          if (distance < min_distance) {
            min_distance = distance;
            result_block = item;
          }
        }
      }
      return result_block;
    },
    redraw_block(block_info, type) {
      // console.log("map detail", this.map_detail)
      const center_x = block_info.block_center_x;
      const center_y = block_info.block_center_y;
      const block_idx_x = block_info.block_x_idx;
      const block_idx_y = block_info.block_y_idx;
      // console.log("redraw block type", type)
      if (type === "shadow") {
        if (block_info.shadow) {
          // console.log("redraw block info",block_info)
          this.drawHexagon(center_x, center_y, block_info);
        } else {
          this.drawShadow(center_x, center_y);
          this.drawAnimal(block_info);
        }
        this.drawStructure(block_info);
        this.map_detail[block_idx_y][block_idx_x].shadow = !this.map_detail[block_idx_y][block_idx_x].shadow;
      } else {
        this.drawHexagon(center_x, center_y, block_info);
        if (block_info.shadow) {
          this.drawShadow(center_x, center_y);
        }
        this.drawAnimal(block_info);
        this.drawStructure(block_info);
      }
      if (this.manual_config_mode){
        this.drawDigits();
      }
      if (this.showPosition){
        this.drawBlockInfo(block_info);
      }
    },
    drawShadow(center_x, center_y) {
      this.createPolygonPath(center_x, center_y, this.r, 6, Math.PI / 6);
      this.ctx.setLineDash([])
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "white"
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawAnimal(block_info) {
      const x = block_info["block_center_x"];
      const y = block_info["block_center_y"];
      if (block_info["bear"]) {
        this.createAnimalRegion(x, y, "black");
      } else if (block_info["cougar"]) {
        this.createAnimalRegion(x, y, "red");
      }
    },
    drawStructure(block_info) {
      const x = block_info["block_center_x"];
      const y = block_info["block_center_y"];
      if (block_info["hut"]) {
        this.createStructureRegion(x, y, "hut", block_info["hut_color"]);
      } else if (block_info["stone"]) {
        this.createStructureRegion(x, y, "stone", block_info["stone_color"]);
      }
    },
    generateClueShadow() {
      this.generateMap();

      // create visited map
      let visited = [];
      let block_list = []

      // set visited map, redraw shadow part and add visited part to list
      for (let i=0;i<this.map_detail.length;i++) {
        visited[i] = [];
        for (let j=0;j<this.map_detail[0].length;j++) {
          visited[i][j] = false;
          let test_flag = false;
          if (this.ownClue.type === "terrain") {
            if (this.map_detail[i][j].block === this.ownClue.value1 ||
                (this.ownClue.value2 !== null && this.map_detail[i][j].block === this.ownClue.value2)) {
              test_flag = true;
            }
          } else if (this.ownClue.type === "animal") {
            if (this.ownClue.value2 === null) {
              if ((this.ownClue.value1 === 'C' && this.map_detail[i][j].cougar) || (this.ownClue.value1 === 'B' && this.map_detail[i][j].bear)) {
                test_flag = true;
              }
            } else {
              if (this.map_detail[i][j].bear || this.map_detail[i][j].cougar) {
                test_flag = true;
              }
            }
          } else if (this.ownClue.type === "structType") {
            if ((this.ownClue.value1==='O' && this.map_detail[i][j].stone) || (this.ownClue.value1==='T' && this.map_detail[i][j].hut)) {
              test_flag = true;
            }
          } else if (this.ownClue.type === "structColor") {
            if (this.map_detail[i][j].hut) {
              test_flag = (COLOR_SHORT_MAP[this.map_detail[i][j].hut_color] === this.ownClue.value1);
            }
            if (this.map_detail[i][j].stone) {
              test_flag = (COLOR_SHORT_MAP[this.map_detail[i][j].stone_color] === this.ownClue.value1);
            }
          }
          if (test_flag) {
            block_list.push(this.map_detail[i][j]);
            visited[i][j] = true;
            this.map_detail[i][j].shadow = true;
          } else {
            this.map_detail[i][j].shadow = false;
          }
          this.redraw_block(this.map_detail[i][j], "shadow");
        }
      }


      // multiple times expand shadow area due to the distance
      let times = 0;
      while(times < this.ownClue.distance) {
        // console.log("expand times: ", times);
        times += 1;
        let block_list2 = [];
        while (block_list.length !== 0) {
          const first_block = block_list[0];
          block_list.splice(0, 1);

          // console.log("first block", first_block)
          // console.log("block list", block_list)

          const block_i = first_block.block_y_idx;
          const block_j = first_block.block_x_idx;
          let direction_list = (block_j % 2 === 0) ? DIRECTION_ODD : DIRECTION_EVEN;

          for (let idx in direction_list) {
            const direction_i = direction_list[idx][0];
            const direction_j = direction_list[idx][1];
            const final_i = block_i + direction_i;
            const final_j = block_j + direction_j;
            if ((final_i >= 0) &&
                (final_i < visited.length) &&
                (final_j >= 0) &&
                (final_j < visited[0].length) &&
                !visited[final_i][final_j]) {
              visited[final_i][final_j] = true;
              block_list2.push(this.map_detail[final_i][final_j]);
              this.map_detail[final_i][final_j].shadow = true;
              this.redraw_block(this.map_detail[final_i][final_j], "shadow");
            }
          }
        }
        // layer by layer expand
        block_list = block_list2;
      }
    },
    checkHutExist(x, y) {
      for (let i in this.hut_info) {
        if (this.hut_info[i].x === x && this.hut_info[i].y === y) {
          return i;
        }
      }
      return -1;
    },
    addToHut(x, y, color) {
      this.hut_info.push({
        x: x,
        y: y,
        color: color
      })
    },
    removeFromHut(x, y) {
      for (let i in this.hut_info) {
        if (this.hut_info[i].x === x && this.hut_info[i].y === y) {
          this.hut_info.splice(i, 1);
        }
      }
    },
    checkStoneExist(x, y) {
      for (let i in this.stone_info) {
        if (this.stone_info[i].x === x && this.stone_info[i].y === y) {
          return i;
        }
      }
      return -1;
    },
    addToStone(x, y, color) {
      this.stone_info.push({
        x: x,
        y: y,
        color: color
      })
    },
    removeFromStone(x, y) {
      for (let i in this.stone_info) {
        if (this.stone_info[i].x === x && this.stone_info[i].y === y) {
          this.stone_info.splice(i, 1);
        }
      }
    },
    handleRChange() {
      let canvas = document.getElementById('canvas')
      const w = canvas.width;
      const h = canvas.height;
      this.ctx.clearRect(0, 0, w, h);
      this.generateMap();
    },
    randomFlip() {
      for(let i in this.board_tile_state) {
        this.board_tile_state[i].flip = (Math.random() < 0.5);
      }
    },
    doLayout() {
      let that = this;
      this.$nextTick(() => {
        that.$refs.clue_table.doLayout();
      })
    }
  },
}
</script>

<style scoped>

.main_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center
}

.canvas_card.el-card__body {
  padding: 0;
}

.colorOptionsContent /deep/ .el-select-dropdown*{
  height:50px;
}

.checklist_button {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

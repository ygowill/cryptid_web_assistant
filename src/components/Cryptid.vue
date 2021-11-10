<template>
  <div>
    <h2>诡影寻踪 网页助手</h2>
    <el-row type="flex">
      <el-col :span="12">
        <el-card shadow="never">
          <el-card shadow="never">
            <canvas height="520" id="canvas" style="display: block; margin: 50px auto;" width="570"
                    @click="handleMouseClick">
              你的浏览器居然不支持Canvas？！赶快换一个吧！！
            </canvas>
          </el-card>
          <el-card shadow="never">
            <el-row :gutter="12" type="flex" justify="center" align="middle">
              <el-col :span="4">
                手动修改：
              </el-col>
              <el-col :span="12">
                <el-radio-group v-model="mode">
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
              <el-col :span="4">
                <el-button @click="handleManualConfig">
                  {{ this.manual_config_tip }}
                </el-button>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="never">
            <el-row :gutter="12">
              <el-col :span="4">
                神秘代码：
              </el-col>
              <el-col :span="20">
                <el-input style="alignment: left" v-model="generatedCode" type="text" size="small" placeholder="请输入内容"
                          @input="handleCodeInputChange"></el-input>
              </el-col>
            </el-row>
          </el-card>

        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" v-if="!this.manual_config_mode">
          <h4>
            线索对照表
          </h4>
          <el-table
              :data="clueData"
              style="width: 100%"
              :row-style="{height: '0'}"
              :cell-style="{padding: '0'}">
            <el-table-column
                prop="clue"
                label="线索"
                width="240"
            >
            </el-table-column>
            <el-table-column label="yourself">
              <template slot-scope="scope">
                <el-button
                    class="checklist_button"
                    size="mini"
                    :type=clue_state_list[scope.$index][0].type
                    @click="handleClick(scope.$index, 0)">{{ clue_state_list[scope.$index][0].label }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="player2">
              <template slot-scope="scope">
                <el-button
                    class="checklist_button"
                    size="mini"
                    :type=clue_state_list[scope.$index][1].type
                    @click="handleClick(scope.$index, 1)">{{ clue_state_list[scope.$index][1].label }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="player3">
              <template slot-scope="scope">
                <el-button
                    class="checklist_button"
                    size="mini"
                    :type=clue_state_list[scope.$index][2].type
                    @click="handleClick(scope.$index, 2)">{{ clue_state_list[scope.$index][2].label }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="player4">
              <template slot-scope="scope">
                <el-button
                    class="checklist_button"
                    size="mini"
                    :type=clue_state_list[scope.$index][3].type
                    @click="handleClick(scope.$index, 3)">{{ clue_state_list[scope.$index][3].label }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="player5">
              <template slot-scope="scope">
                <el-button
                    class="checklist_button"
                    size="mini"
                    :type=clue_state_list[scope.$index][4].type
                    @click="handleClick(scope.$index, 4)">{{ clue_state_list[scope.$index][4].label }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="never" v-if="this.manual_config_mode">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {BEAR, CLUE_DATA, COLOR_MAP, COUGAR, MAP} from "@/assets/constants"
import draggable from 'vuedraggable'

const LZ = require("lz-string")

export default {
  name: "Cryptid",
  components: {
    draggable,
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
      randomIndexArray: [0, 1, 2, 3, 4, 5],
      randomBoolArray: [false, false, false, false, false, false],
      hut_info: [[], [], [], [], [], []],
      stone_info: [[], [], [], [], [], []],
      clueData: [],
      mode: 0,
      clue_state_list: [],
      click_x: 0,
      click_y: 0,
      generatedCode: "",
      manual_config_tip: "展开手动布局",
      manual_config_mode: false,
      chosenColor: "green",
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
      ]
    };
  },
  methods: {
    initCanvas() {
      let canvas = document.getElementById('canvas')
      this.ctx = canvas.getContext("2d")

      for (let i = 0; i < this.map_height; i++) {
        this.map_detail[i] = [];
        for (let j = 0; j < this.map_width; j++) {
          this.map_detail[i][j] = 0;
        }
      }

      const randomIndexArray = this.generateRandomIndexArray(6);
      const randomBoolArray = this.generateRandomBoolArray(6);
      const generation_info = {
        "index_array": randomIndexArray,
        "flip_array": randomBoolArray
      }

      this.generateMap(generation_info);
      // console.log(this.map_detail);
    },
    handleMouseClick(ev) {
      let x, y;
      if (ev.layerX || ev.layerX === 0) {
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX === 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
      }
      const block_info = this.getNearestBlock(x, y);
      console.log("block info", block_info)
      if (this.mode === 0) {
        console.log("shadow mode")
      }  else if (this.mode === 1) {
        console.log("add hut to map");
        console.log("block info", block_info)
        console.log("map detail", this.map_detail)
        this.map_detail[block_info["block_x_idx"]][block_info["block_y_idx"]]["hut"] = true;
        this.map_detail[block_info["block_x_idx"]][block_info["block_y_idx"]]["hut_color"] = this.chosenColor;
      } else if (this.mode === 2) {
        console.log("add stone to map");
      }
      console.log("block_info", block_info)
      this.redraw_block(block_info);
    },
    handleCodeInputChange(input) {
      let complete_code = "N4IglgdgJgpgHgfQIYCcVIJ4gFwG0" + input + "A";
      try {
        const generation_info = LZ.decompressFromEncodedURIComponent(complete_code);
        this.generateMap(JSON.parse(generation_info));
      } catch (e) {
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
        const generation_info = {
          "index_array": [0, 1, 2, 3, 4, 5, 6],
          "flip_array": [false, false, false, false, false, false]
        }
        this.generateMap(generation_info);
      }
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
      let tile_location = 0;
      for (let i = 0; i < this.randomIndexArray.length; i++) {
        if (this.randomIndexArray[i] === tile_id) {
          tile_location = i;
          break;
        }
      }
      this.randomBoolArray[tile_location] = !this.randomBoolArray[tile_location];
      this.$notify({
        title: '成功',
        message: '已成功旋转板块' + (tile_id + 1).toString(),
        duration: 1000
      });
      this.generateMap({
        "index_array": this.randomIndexArray,
        "flip_array": this.randomBoolArray
      })
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

      console.log("after drag", this.tile_list1, this.tile_list2)
      if (this.tile_list1.length !== 3) {
        this.$notify({
          title: '错误',
          message: '无法生成地图，请将板块排列成3*2的形状',
          duration: 1000
        });
        return;
      }

      let indexArray = []
      for (let i = 0; i < 3; i++) {
        indexArray.push(this.tile_list1[i].id);
        indexArray.push(this.tile_list2[i].id);
      }
      console.log("index array", indexArray);
      this.randomIndexArray = indexArray;
      this.generateMap({
        "index_array": this.randomIndexArray,
        "flip_array": this.randomBoolArray
      })
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
    handleClick(index, col) {
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
    },
    generateMap(generation_info) {
      // generate
      const gen_str = JSON.stringify(generation_info);
      const code = LZ.compressToEncodedURIComponent(gen_str);
      this.generatedCode = code.slice("N4IglgdgJgpgHgfQIYCcVIJ4gFwG0".length, -1)

      this.randomIndexArray = generation_info["index_array"];
      this.randomBoolArray = generation_info["flip_array"];

      let start_y = this.r * Math.sin(this.a);
      for (let i = 0; i < 3; i++) {
        let start_x = this.r;
        for (let j = 0; j < 2; j++) {
          const tile_id = this.randomIndexArray[i * 2 + j];
          const map_info = {
            "tile_id": tile_id,
            "tile_start_x": j,
            "tile_start_y": i,
            "tile": MAP[tile_id],
            "bear": BEAR[tile_id],
            "cougar": COUGAR[tile_id],
            "flip": this.randomBoolArray[i * 2 + j],
          }
          // console.log("map:", tile_id);
          // console.log(MAP[tile_id]);
          this.drawTile(start_x, start_y, map_info);
          start_x += 9 * this.r + 0.25 * this.r;
        }
        start_y += 6 * this.r * Math.sin(this.a) + 0.4 * this.r;
      }
      if (this.manual_config_mode) {
        // console.log("manual config mode on!")
        // console.log(this.randomIndexArray)
        let canvas = document.getElementById('canvas');
        let number_start_y = canvas.height / 6;
        for (let i = 0; i < 3; i++) {
          let number_start_x = canvas.width / 4;
          for (let j = 0; j < 2; j++) {
            const current_number = i * 2 + j;
            this.ctx.font = "60px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "black";
            this.ctx.fillText((this.randomIndexArray[current_number] + 1).toString(), number_start_x, number_start_y);
            number_start_x += canvas.width / 2;
          }
          number_start_y += canvas.height / 3
        }
      }
    },
    generateRandomBoolArray(length) {
      const array = [];
      for (let i = 0; i < length; i++) {
        array.push(Math.random() < 0.5);
      }
      return array;
    },
    generateRandomIndexArray(length) {
      const arr = Array.from(new Array(length).keys());
      for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
      }
      return arr;
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
            "block_x_idx": !map_info.flip ? map_info["tile_start_x"] * 6 + i : 11 - (map_info["tile_start_x"] * 6 + i),
            "block_y_idx": !map_info.flip ? map_info["tile_start_y"] * 3 + j : 8 - (map_info["tile_start_y"] * 3 + j),
            "block": !map_info.flip ? map_info["tile"][block_id] : map_info["tile"][17 - block_id],
            "bear": !map_info.flip ? map_info["bear"][block_id] === 1 : map_info["bear"][17 - block_id],
            "cougar": !map_info.flip ? map_info["cougar"][block_id] === 1 : map_info["cougar"][17 - block_id],
            "shadow": false
          }

          const block_append_info = {
            "hut": false,
            "hut_color": "black",
            "stone": false,
            "stone_color": "black",
          }

          if (Object.prototype.hasOwnProperty.call(this.map_detail[block_info["block_y_idx"]][block_info["block_x_idx"]], 'hut') || this.map_detail[block_info["block_y_idx"]][block_info["block_x_idx"]]["hut"] === undefined) {
            for (let key in block_append_info) {
              block_info[key] = block_append_info[key];
            }
          } else {
            for (let key in block_append_info) {
              block_info[key] = this.map_detail[block_info["block_y_idx"]][block_info["block_x_idx"]][key];
            }
          }

          this.map_detail[block_info["block_y_idx"]][block_info["block_x_idx"]] = block_info;
          // console.log(x, y, block_info["block"]);
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

      if (block_info["bear"]) {
        this.createAnimalRegion(x, y, "black");
      } else if (block_info["cougar"]) {
        this.createAnimalRegion(x, y, "red");
      } else if (block_info["hut"]) {
        this.createStructure(x, y, "hut", block_info["hut_color"]);
      } else if (block_info["stone"]) {
        this.createStructure(x, y, "stone", block_info["stone_color"]);
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
    createStructure(centerX, centerY, type, color) {
      let edges = 4;
      let start_angle = 0;
      if (type === "hut") {
        edges = 8;
        start_angle = Math.PI / 8;
      } else if (type === "stone") {
        edges = 3;
        start_angle = 0;
      }
      this.createPolygonPath(centerX, centerY, this.r / 2, edges, start_angle);
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = color;
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
    redraw_block(block_info) {
      // console.log("map detail", this.map_detail)
      const center_x = block_info.block_center_x;
      const center_y = block_info.block_center_y;
      const block_idx_x = block_info.block_x_idx;
      const block_idx_y = block_info.block_y_idx;
      if (block_info.shadow) {
        this.drawHexagon(center_x, center_y, block_info);
        this.map_detail[block_idx_y][block_idx_x].shadow = false;
      } else {
        this.createPolygonPath(center_x, center_y, this.r, 6, Math.PI / 6);
        this.ctx.setLineDash([])
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "white"
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        this.ctx.fill();
        this.ctx.stroke();
        if (block_info.bear) {
          this.createAnimalRegion(center_x, center_y, "black");
        } else if (block_info.cougar) {
          this.createAnimalRegion(center_x, center_y, "red");
        } else if (block_info.hut) {
          this.createStructure(center_x, center_y, "hut", block_info.hut_color);
        } else if (block_info.stone) {
          this.createStructure(center_x, center_y, "stone", block_info.stone_color);
        }
        this.map_detail[block_idx_y][block_idx_x].shadow = true;
      }
    },
  },
}
</script>

<style scoped>


.colorOptionsContent /deep/ .el-select-dropdown*{
  height:50px;
}

.checklist_button {
  width: 60%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

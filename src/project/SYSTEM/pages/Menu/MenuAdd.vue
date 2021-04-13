<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="120px" size="small">
      <el-form-item label="系统：" prop="terminal">
        <el-radio-group v-model="dataForm.terminal">
          <el-radio key="PC" label="PC">
            PC
          </el-radio>
          <el-radio key="APP" label="APP">
            APP
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型：" prop="menuType">
        <el-radio-group v-model="dataForm.menuType">
          <el-radio v-for="(subType, index) in typeList" :key="index" :label="subType.key" :value="subType.key">
            {{ subType.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工厂：">
        <el-checkbox-group v-model="dataForm.deptIdList">
          <el-checkbox v-for="(item, index) in factory" :key="index" :label="item.id" name="factory">
            {{ item.deptShort }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="名称：" prop="menuName">
        <el-input v-model="dataForm.menuName" :placeholder="'名称'" />
      </el-form-item>
      <el-form-item label="上级菜单：" prop="parentName">
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" style="height: 100%; overflow: auto;">
          <template #reference>
            <el-input v-model="dataForm.parentName" :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input" />
          </template>
            <el-tree ref="menuListTree" :data="menuList" :props="menuListTreeProps" node-key="id" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false" @current-change="menuListTreeCurrentChangeHandle" />
        </el-popover>
      </el-form-item>
      <el-form-item
        v-if="dataForm.menuType !== 'B'"
        label="菜单路由："
        :rules="[{required: true,validator: validateUrl,message: '菜单URL不能为空 ',trigger: 'blur'}]"
      >
        <el-input v-model="dataForm.menuUrl" placeholder="菜单路由：" />
      </el-form-item>
      <el-form-item v-if="dataForm.menuType !== 'C'" label="授权标识：" prop="perms">
        <el-input v-model="dataForm.permission" placeholder="多个用逗号分隔, 如: user:list,user:create" />
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 'B'" label="排序号：">
        <el-input-number v-model="dataForm.menuOrder" controls-position="right" :min="0" label="排序号" />
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 'B'" label="菜单图标：">
        <el-row>
          <el-col :span="24">
            <el-popover placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
              <template #reference>
                <el-input v-model="dataForm.menuIcon" placeholder="菜单图标名称" class="icon-list__input" clearable />
              </template>
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  :class="{'is-active': item === dataForm.menuIcon}"
                  @click="() => dataForm.menuIcon = item"
                >
                  <em :class="item" class="iconfont" style="font-size: 20px;" />
                </el-button>
              </div>
            </el-popover>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="dataForm.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="visible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="dataFormSubmit()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ComponentInternalInstance, ComponentPublicInstance, defineComponent, getCurrentInstance, ref } from 'vue'
import { treeDataTranslate, MenuBbj } from '@/utils'
import { GET_DEPT, ALL_MENU_LIST, MENU_ADD, MENU_UPDATE } from '@/api/api'

export default defineComponent({
  name: 'MenuAdd',
  emits: ['refreshDataList'],
  setup (props, { emit }) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as ComponentPublicInstance
    const dataForm = ref({
      id: '',
      deptIdList: [],
      terminal: 'PC',
      menuType: 'C',
      menuName: '',
      parentId: '0',
      parentName: '',
      menuUrl: '',
      permission: '',
      menuOrder: 0,
      menuIcon: '',
      remark: '',
      children: []
    })
    const typeList = [
      {
        label: '目录',
        key: 'C'
      }, {
        label: '菜单',
        key: 'M'
      }, {
        label: '按钮',
        key: 'B'
      }, {
        label: '三级页面',
        key: 'P'
      }
    ]
    const iconList: string[] = [
      'factory-shouye',
      'factory-shezhi',
      'factory-luru',
      'factory-shenhe',
      'factory-baobiao',
      'factory-yibiao',
      'factory-icon-test',
      'factory-baozhuang',
      'factory-filter',
      'factory-chechuangjiqiren',
      'factory-qiyaguanjianhua',
      'factory-chaohuo',
      'factory-guanquguanli',
      'factory-air-compressor',
      'factory-shajun',
      'factory-guolv',
      'factory-chuiping',
      'factory-yuanshui',
      'factory-wendangguanli',
      'factory-kucunguanli',
      'factory-calc'
    ]
    const dataRule = {
      terminal: [
        {
          required: true,
          message: '系统不能为空',
          trigger: 'blur'
        }
      ],
      menuName: [
        {
          required: true,
          message: '菜单名称不能为空',
          trigger: 'blur'
        }
      ],
      parentName: [
        {
          required: true,
          message: '上级菜单不能为空',
          trigger: 'change'
        }
      ]
    }
    const menuListTreeProps = {
      label: 'menuName',
      children: 'children'
    }
    const dataFormRef = ref()
    const menuList = ref([] as MenuBbj[])
    const factory = ref([])
    const type = ref(false)
    const visible = ref(false)

    const init = (row?: MenuBbj) => {
      console.log(row)
      GET_DEPT({
        deptType: ['FACTORY', 'FAKE_FACTORY']
      }).then(({ data }) => {
        factory.value = data.data
      })
      ALL_MENU_LIST({
        factory: 'common'
      }).then(({ data }) => {
        menuList.value = treeDataTranslate(data.data)
      }).then(() => {
        visible.value = true
        if (!row) {
          // 新增
          type.value = true
          dataForm.value = {
            id: '',
            deptIdList: [],
            terminal: 'PC',
            menuType: 'C',
            menuName: '',
            parentId: '0',
            parentName: '',
            menuUrl: '',
            permission: '',
            menuOrder: 0,
            menuIcon: '',
            remark: '',
            children: []
          }
        } else {
          // 修改
          type.value = false
          dataForm.value.id = row.id
          dataForm.value.deptIdList = row.deptIdList
          dataForm.value.terminal = row.terminal
          dataForm.value.menuType = row.menuType
          dataForm.value.menuName = row.menuName
          dataForm.value.parentId = row.parentId
          dataForm.value.parentName = row.parentName
          dataForm.value.menuUrl = row.menuUrl
          dataForm.value.permission = row.permission
          dataForm.value.menuOrder = row.menuOrder
          dataForm.value.menuIcon = row.menuIcon
          dataForm.value.remark = row.remark
        }
      })
    }
    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid:boolean) => {
        if (valid) {
          let http
          type.value ? http = MENU_ADD : http = MENU_UPDATE
          http(dataForm.value).then(() => {
            proxy.$successToast('操作成功')
            visible.value = false
            emit('refreshDataList')
          })
        }
      })
    }
    // eslint-disable-next-line
    const validateUrl = (rule: string, value: string, callback: (ctx?: any) => any) => {
      if (dataForm.value.menuType === 'M' && !/\S/.test(value)) {
        return callback(new Error('菜单URL不能为空'))
      }
      return callback()
    }
    const menuListTreeCurrentChangeHandle = (data:MenuBbj) => {
      dataForm.value.parentId = data.id
      dataForm.value.parentName = data.menuName
    }

    return {
      menuList,
      menuListTreeProps,
      iconList,
      typeList,
      dataForm,
      dataRule,
      factory,
      dataFormRef,
      visible,
      init,
      validateUrl,
      menuListTreeCurrentChangeHandle,
      dataFormSubmit
    }
  }
})
</script>

<style lang="scss">
  .mod-menu__icon-popover{
    min-width: 370px!important;
  }
</style>
<style lang="scss" scoped>
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      min-width: 370px!important;
    }
    &__icon-list {
      max-height: 180px;
      margin: -8px 0 0 -8px;
      padding: 0;
      > .el-button {
        margin: 8px 0 0 8px;
        padding: 8px;
        > span {
          display: inline-block;
          width: 18px;
          height: 18px;
          font-size: 18px;
          vertical-align: middle;
        }
      }
    }
    .icon-list__tips {
      color: #e6a23c;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
</style>

<template>
  <MdsCard
    title="数据字典"
    :name="'parameter'"
    :pack-up="false"
    style="background: #fff;"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="k-card">
          <h4 class="k-card_title">
            <span>参数类型</span>
            <el-button type="text" icon="el-icon-plus" style="margin-right: 10px; color: #fff; font-weight: 800;" @click="addOrUpdate('type')" />
          </h4>
          <div class="search-bar">
            <el-select v-model="factoryForSearch" size="small" clearable placeholder="请选择" @clear="stringForSearch===''?getParentItemsList(true):false">
              <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
            </el-select>
            <el-input v-model="stringForSearch" size="small" placeholder="请输入" suffix-icon="el-icon-search" clearable @clear="getParentItemsList(true)" @blur="factoryForSearch===''&&stringForSearch===''? getParentItemsList(true):false" />
            <el-button type="primary" size="small" :disabled="stringForSearch.trim()==='' && factoryForSearch===''" @click="getParentItemsList(true)">
              查询
            </el-button>
          </div>
          <div style="padding: 10px;">
            <el-table
              header-row-class-name="tableHead"
              row-key="index"
              :data="targetInfoList"
              highlight-current-row
              border
              tooltip-effect="dark"
              class="newTable"
              size="small"
              @row-click="getChildItemList"
            >
              <el-table-column type="index" width="50" label="序号" fixed />
              <el-table-column :show-overflow-tooltip="true" label="工厂" prop="factoryName" />
              <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码" width="110" />
              <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称" width="110" />
              <el-table-column width="96" label="操作" fixed="right">
                <template #default="scope">
                  <el-button type="text" @click="removeItems(scope.row)">
                    删除
                  </el-button>
                  <el-button type="text" @click="addOrUpdate('type', scope.row)">
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="targetInfoList.length!==0" :current-page="currPageFromParent" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromParent" layout="total, prev, pager, next, jumper" :total="totalCountFromParent" @size-change="handlePageSizeChangeFromMain" @current-change="handleCurrentPageChangeFromMain" />
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="k-card">
          <h4 class="k-card_title">
            <span>参数</span>
          </h4>
          <div class="right">
            <span><em class="title-icon" style="background: #487bff;" />详细参数</span>
            <el-button v-if="isFocusChild" size="small" type="primary" @click="addOrUpdate('param',tempParentRow)">
              新增
            </el-button>
          </div>
          <div style="padding: 10px;">
            <el-table header-row-class-name="tableHead" :data="targetParameterList" border tooltip-effect="dark" class="newTable" size="small">
              <el-table-column type="index" width="50" label="序号" fixed />
              <el-table-column prop="factoryName" :show-overflow-tooltip="true" label="工厂" width="100" />
              <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码">
                <template #default>
                  {{ tempParentRow.dictType }}
                </template>
              </el-table-column>
              <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称">
                <template #default>
                  {{ tempParentRow.dictName }}
                </template>
              </el-table-column>
              <el-table-column prop="dictCode" :show-overflow-tooltip="true" label="参数编码" />
              <el-table-column prop="dictValue" :show-overflow-tooltip="true" label="参数名称" />
              <el-table-column v-if="targetParameterList.length!==0" width="96" label="操作" fixed="right">
                <template #default="scope">
                  <el-button type="text" @click="removeItems(scope.row)">
                    删除
                  </el-button>
                  <el-button type="text" @click="addOrUpdate('param', tempParentRow, scope.row)">
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="targetParameterList.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalCount" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
          </div>
        </div>
      </el-col>
    </el-row>
  </MdsCard>
  <ParameterDialog v-if="isDialogShow" ref="addOrUpdateItemRef" :factory-list="factoryList" @refreshParentDataList="getParentItemsList" @refreshChildDataList="getChildItemListFromChange" />
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref
} from 'vue'
import { GET_FACTORY, GET_DICT, GET_DICT_ITEM, DEL_DICT, DEL_DICT_ITEM } from '@/api/api'
import ParameterDialog from './parameter_dialog'

export default defineComponent({
  name: 'ParameterPage',
  components: {
    ParameterDialog
  },
  setup () {
    const ctx = getCurrentInstance()
    const proxy = ctx.proxy

    const isDialogShow = ref(false)
    const addOrUpdateItemRef = ref()
    const factoryForSearch = ref('')
    const stringForSearch = ref('')
    const factoryList = ref([])
    const getFactoryList = () => {
      console.log(factoryList)
      GET_FACTORY({ deptType: ['factory'] }).then(({ data }) => {
        factoryList.value = data.data
        factoryList.value.push({
          deptCode: 'common',
          deptName: '共用字段',
          deptShort: '共用字段',
          deptType: 'FACTORY',
          id: 'common'
        })
      })
    }

    const targetInfoList = ref([])
    const currPageFromParent = ref(1)
    const pageSizeFromParent = ref(10)
    const totalCountFromParent = ref(0)
    const tempParentRow = ref({})
    // 改变每页条数
    const handlePageSizeChangeFromMain = (val) => {
      pageSizeFromParent.value = val
      getParentItemsList(false)
    }
    // 跳转页数
    const handleCurrentPageChangeFromMain = (val) => {
      currPageFromParent.value = val
      getParentItemsList(false)
    }
    // 获取类型
    const getParentItemsList = (haveParas) => {
      if (haveParas) {
        currPageFromParent.value = 1
      }
      const parasObj = {
        factory: factoryForSearch.value,
        typeOrName: stringForSearch.value,
        current: currPageFromParent.value,
        size: pageSizeFromParent.value
      }
      GET_DICT(parasObj).then(({ data }) => {
        isFocusChild.value = false
        targetInfoList.value = data.data.records
        targetParameterList.value = []
        totalCountFromParent.value = data.data.total
        currPageFromParent.value = data.data.current
        pageSizeFromParent.value = data.data.size
      })
    }
    // row点击
    const getChildItemList = (row, col) => {
      if (col.label !== '操作' && tempParentRow.value.id !== row.id) {
        currPage.value = 1
        tempParentRow.value = row
        getChildItemListFromChange()
      }
    }

    const isFocusChild = ref(false)
    const targetParameterList = ref([])
    const currPage = ref(1)
    const pageSize = ref(10)
    const totalCount = ref(0)
    // 改变每页条数
    const handlePageSizeChange = (val) => {
      pageSize.value = val
      getChildItemListFromChange()
    }
    // 跳转页数
    const handleCurrentPageChange = (val) => {
      currPage.value = val
      getChildItemListFromChange()
    }
    // 右侧
    const getChildItemListFromChange = () => {
      GET_DICT_ITEM({
        dictId: tempParentRow.value.id,
        size: pageSize.value,
        current: currPage.value
      }).then(({ data }) => {
        isFocusChild.value = true
        if (data.data.records.length !== 0) {
          targetParameterList.value = data.data.records
        } else {
          targetParameterList.value = []
        }
        totalCount.value = data.data.total
        currPage.value = data.data.current
        pageSize.value = data.data.size
      })
    }

    const removeItems = (row) => {
      proxy.$confirm(row.dictId ? '确认删除参数, 是否继续?' : '确认删除参数类型, 是否继续?', row.dictId ? '删除参数' : '删除参数类型', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.dictId) {
          DEL_DICT_ITEM({
            ids: [row.id]
          }).then(() => {
            getChildItemListFromChange()
          })
        } else {
          DEL_DICT({
            ids: [row.id]
          }).then(() => {
            getParentItemsList()
          })
        }
      })
    }

    const addOrUpdate = async (parasLevel, temRow, row) => {
      isDialogShow.value = true
      await nextTick()
      addOrUpdateItemRef.value.init(parasLevel, temRow, row)
    }

    onMounted(() => {
      getParentItemsList(true)
      getFactoryList()
    })

    return {
      isDialogShow,
      addOrUpdateItemRef,
      isFocusChild,
      tempParentRow,
      factoryForSearch,
      stringForSearch,
      factoryList,
      targetInfoList,
      currPageFromParent,
      pageSizeFromParent,
      totalCountFromParent,
      targetParameterList,
      currPage,
      pageSize,
      totalCount,
      getParentItemsList,
      getChildItemList,
      getChildItemListFromChange,
      removeItems,
      addOrUpdate,
      handlePageSizeChangeFromMain,
      handleCurrentPageChangeFromMain,
      handlePageSizeChange,
      handleCurrentPageChange
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.search-bar{
  display: inline-grid;
  grid-column-gap: 10px;
  grid-template-columns: 1fr 1fr 64px;
  padding: 10px;
}
.right{
  position: relative;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
  padding-left: 10px;
  font-weight: bold;
  font-size: 14px !important;
  line-height: 32px;
  &::before {
    position: absolute;
    top: 34%;
    left: 2px;
    width: 4px;
    height: 12px;
    background: $--color-primary;
    border-radius: 2px;
    content: "";
  }
}
</style>

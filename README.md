# monitor_guangzhou_customization

##雷达系统硬代码说明
```
1、src/components/layout/header/IndexHeader.vue
   第10行左右处代码，每个雷达系统的名称不同，需要硬编码，相应的css处也要改变
   如若产生冲突，建议查看git历史代码回滚
   
2、src/views/device-preview/DevicePreViewIndex.vue
   第535~539行左右处代码，方便雷达部署加的临时代码,用于写死在单层楼创建雷达的高度
   如若产生冲突，建议查看git历史代码回滚
   
3、src/views/trace-replay/components/TraceReplayModel.vue
   第205~210行代码，因为建立的设备组与楼层的名称不对应，故硬编码；建议日后设定组与楼层名称保持一致，泛化这段代码
   
4、src/views/index/Index.vue 3~5行代码
   除了茶室外，其余雷达系统都未上传感器环境监测卡片功能，如果系统没上建议在该代码处删除这段
   
5、vue.config.js 53行代码
   更换服务器接口地址
   
6、src/views/index/components/SecurityAlarm.vue
   168行左右，首页预警楼层跳转到对应的模型，与第三项一样建议泛化
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

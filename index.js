/*
* @Author: zheng
* @Date:   2018-04-08 11:18:31
* @Last Modified by:   zheng
* @Last Modified time: 2018-04-08 12:13:41
*/
const model = require('./crawler'),
 		basicPath = 'http://www.mzitu.com/page/'; //地址;
let start = 1, end =  2;  //从第几页开始爬
const main = async url => {
	let list = [], index = 0;
	const data = await model.getPage(url)
	list = model.getUrl(data)
	downLoadImages(list,index);//下注
}
const downLoadImages = async (list, index) =>{
	if( index == list.length) {
		start ++;
		if(start < end) {
			main(basicPath + start) ;//进行下一页
		}
		return false;
	}
	if(model.getTitle(list[index])) {
		let item = await model.getPage(list[index].url) ,//获取图片所在网页的url
			imageNum = model.getImagesNum(item.res,list[index].name);//获取这组图片的数量
			for( let i = 1 ;i < imageNum ; i++){
				let page = await model.getPage(list[index].url+`/${i}`);
				await model.downloadImage(page,i)
			}
			index ++;
			downLoadImages(list,index);//循环完成下载下一组
	}else {
		index ++
		downLoadImages(list,index);//下载下一组
	}
}
main(basicPath + start)
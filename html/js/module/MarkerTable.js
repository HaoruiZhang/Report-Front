
const MarkerTable = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array,
    prefix: String,
    headers: Array,
  },
  setup(props) {
    const ifShowExplain = ref(false);
    const tableId = ref(props.prefix + '-marker-table');
    const tableContainerId = ref(props.prefix + '-table-container');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" title="goodgood TODO" width="14" height="14" viewBox="0 0 15 14" fill="none">
  <path d="M7.50003 4.38059C6.79946 4.38059 6.19656 4.9686 6.19656 5.79352H4.99656C4.99656 4.36995 6.07439 3.18059 7.50003 3.18059C8.91555 3.18059 10.0035 4.38066 10.0035 5.79352C10.0035 7.04076 9.18859 7.74044 8.50503 8.31242V9.02698H7.30503V8.14907C7.30503 8.02913 7.33179 7.91699 7.37034 7.82322C7.40369 7.74211 7.4666 7.62435 7.58116 7.52575L7.65257 7.46103L7.66162 7.45345C8.42252 6.81643 8.8035 6.45016 8.8035 5.79352C8.8035 4.97931 8.19048 4.38059 7.50003 4.38059Z"/>
  <path d="M8.5678 9.9167H7.3678V11.1167H8.5678V9.9167Z"/>
  <path d="M7.5 14C11.366 14 14.5 10.866 14.5 7C14.5 3.13401 11.366 0 7.5 0C3.63401 0 0.5 3.13401 0.5 7C0.5 10.866 3.63401 14 7.5 14ZM7.5 12.8C4.29675 12.8 1.7 10.2033 1.7 7C1.7 3.79675 4.29675 1.2 7.5 1.2C10.7033 1.2 13.3 3.79675 13.3 7C13.3 10.2033 10.7033 12.8 7.5 12.8Z" />
  <path d="M5.55147 5.29352C5.76047 4.36272 6.54289 3.68059 7.50003 3.68059C8.61163 3.68059 9.50351 4.62818 9.50351 5.79352C9.50351 6.78374 8.87953 7.34709 8.18416 7.92896L8.00503 8.07885V8.31242V8.52698H7.80503V8.14907C7.80503 8.10238 7.81579 8.05469 7.83279 8.01334C7.84819 7.97587 7.87244 7.93474 7.90732 7.90473L7.90743 7.90485L7.91695 7.89622L7.98107 7.8381L7.98258 7.83683C8.71472 7.2239 9.3035 6.71599 9.3035 5.79352C9.3035 4.72627 8.48918 3.88059 7.50003 3.88059C6.6619 3.88059 5.96097 4.468 5.75673 5.29352H5.55147ZM7.8678 10.4167H8.0678V10.6167H7.8678V10.4167ZM14 7C14 10.5899 11.0899 13.5 7.5 13.5C3.91015 13.5 1 10.5899 1 7C1 3.41015 3.91015 0.5 7.5 0.5C11.0899 0.5 14 3.41015 14 7ZM1.2 7C1.2 10.4794 4.02061 13.3 7.5 13.3C10.9794 13.3 13.8 10.4794 13.8 7C13.8 3.52061 10.9794 0.7 7.5 0.7C4.02061 0.7 1.2 3.52061 1.2 7Z" stroke="#A6ACBD"/>
</svg>`;

    const leftArrow = `<svg style='position:relative;top:6.5px;' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4L3.5 8L7.5 12" stroke="#5F0085" stroke-width="1.2"/><path d="M12 4L8 8L12 12" stroke="#5F0085" stroke-width="1.2"/></svg>`;
    const rightArrow = `<svg style='position:relative;top:6.5px;' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M8.5 4L12.5 8L8.5 12' stroke='#5F0085' stroke-width='1.2'/><path d='M4 4L8 8L4 12' stroke='#5F0085' stroke-width='1.2'/></svg>`;
    function getElementDirection(element) {
      const childrenArr = Array.from(element.parentElement.children);
      return childrenArr.indexOf(element) < childrenArr.length / 2 ? 'left' : 'right';
    };
    function reStyle(tableContainer, curTable) {
      var rows = tableContainer.getElementsByTagName("tr");
      for (var i = 2; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        for (var j = 2; j < cells.length; j += 2) {
          var l2fcValue = parseFloat(cells[j].textContent);
          var pvalue = parseFloat(cells[j + 1].textContent);
          if (l2fcValue < 0 || pvalue > 0.1) {
            cells[j].classList.add("gray-text");
            cells[j + 1].classList.add("gray-text");
          };
        };
      };

      /**
       * 给翻页的省略号添加样式
       */
      console.log('tableContainer', tableContainer);
      const allPages = tableContainer.querySelectorAll('.dt-paging-button.current');
      if (allPages.length) {
        let curpage = parseInt(allPages[allPages.length - 1].innerHTML.replace(',', ''));
        const ellipsisBtns = tableContainer.querySelectorAll(".ellipsis");
        for (let i = 0; i < ellipsisBtns.length; i++) {
          const elBtn = ellipsisBtns[i];
          const elDIrcetion = getElementDirection(elBtn);
          elBtn.addEventListener('click', () => {
            curTable.page(elDIrcetion === 'left' ? curpage - 6 : curpage + 4).draw('page');
          });
          elBtn.addEventListener('mouseenter', (e) => {
            elBtn.innerHTML = elDIrcetion === 'left' ? leftArrow : rightArrow;
          });
          elBtn.addEventListener('mouseleave', (e) => {
            elBtn.innerHTML = '...';
          });
        };
      };


      /*
        检测是否为空，当为空时，添加一行表格，增加图标
      */
      const emptyRow = tableContainer.querySelector('.dt-empty');
      if (!emptyRow) return;
      const emptyRowParent = emptyRow.parentElement;
      const iconRow = document.createElement('tr');
      iconRow.classList.add('icon-row');
      emptyRowParent.parentElement.insertBefore(iconRow, emptyRowParent);
      const iconCell = document.createElement('td');
      iconRow.appendChild(iconCell);
      iconCell.colSpan = 8;
      iconCell.style.paddingTop = '20px';
      iconCell.style.paddingBottom = '0px';
      iconCell.style.paddingLeft = '570px';
      iconCell.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" lineHeight="16" viewBox="0 0 16 16" fill="none">
  <path d="M2.5 5.25V13C2.5 13.2761 2.72386 13.5 3 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V5.25M2.5 5.25L4.00435 2.74275C4.09471 2.59215 4.25746 2.5 4.4331 2.5H8H11.5669C11.7425 2.5 11.9053 2.59215 11.9957 2.74275L13.5 5.25M2.5 5.25H13.5" stroke="#A6ACBD" stroke-width="1.2"/>
  <path d="M5.79895 8.47705H10.3356" stroke="#A6ACBD" stroke-width="1.2"/>
</svg>`;
    };

    onMounted(async () => {
      console.log('Mount MarkerTable: ', props.prefix, props.headers);
      const clusterNums = props.data[0].length / 2 - 1;

      let clusterHeaderTemplate = '<th colspan="2" class="cluster-header">Marker</th>';
      for (let i = 0; i < clusterNums; i++) {
        clusterHeaderTemplate += `<th colspan="2" class="cluster-header">${props.headers?.length ? props.headers[i] : ('Cluster' + (i + 1))}</th>`;
      };

      let geneidHeaderTemplate = "<th class='geneid-header'>ID</th> <th class='geneid-header'>Name</th>";
      for (let i = 0; i < clusterNums; i++) {
        geneidHeaderTemplate += `<th class="geneid-header">L2FC<span onmouseenter="showMessage(event,'l2fc')" onmouseleave="hideMessage()" class="msgBtn">${svg}</span></th>
                                 <th class="geneid-header">p-value<span onmouseenter="showMessage(event,'pvalue')"  onmouseleave="hideMessage()" class="msgBtn">${svg}</span></th>`;
      };

      $(`#${tableContainerId.value}`).html(`
          <table id="${tableId.value}" cellpadding="0" cellspacing="0" border="0" class="display">
              <thead>
                  <tr> ${clusterHeaderTemplate} </tr>
                  <tr> ${geneidHeaderTemplate}  </tr>
              </thead>
          </table>`
      );
      const topTool = props.prefix === 'cellbin-gene' ? {
        topStart: null,
        topEnd: {
          search: {
            placeholder: 'Please enter key words',
            text: ''
          }
        }
      } : {
        topEnd: null,
        topStart: {
          search: {
            placeholder: 'Please enter key words',
            text: ''
          }
        }
      };

      const markerTable = new DataTable(`#${tableId.value}`, {
        "data": props.data,
        "scrollX": true,
        layout: {
          ...topTool,
          bottom: ['info', 'paging', 'pageLength'],
          bottomStart: null,
          bottomEnd: null
        }
      });
      const tableContainer = document.getElementById(tableContainerId.value);
      markerTable.on('draw.dt', function () {
        reStyle(tableContainer, markerTable);
      });
      await nextTick();
      reStyle(tableContainer, markerTable);

      const pagingBox = document.createElement('div');
      const spanEle = document.createElement('span');
      const inputEle = document.createElement('input');
      inputEle.type = 'number';
      spanEle.innerHTML = 'Page to';
      pagingBox.setAttribute('class', 'pageTo-box');
      pagingBox.appendChild(spanEle);
      pagingBox.appendChild(inputEle);
      inputEle.addEventListener('change', function (e) {
        const inputVal = e.target.value;
        markerTable.page(parseInt(inputVal) - 1).draw('page');
      });

      const dtPaging = tableContainer.querySelector('.dt-paging');

      dtPaging.parentNode.insertBefore(pagingBox, dtPaging);

      const searchInput = tableContainer.getElementsByClassName('dt-input')[0];
      console.log('searchInput', searchInput);
      searchInput.addEventListener('focus', function () {
        this.parentElement.classList.add('highlight');
      });
      searchInput.addEventListener('blur', function () {
        this.parentElement.classList.remove('highlight');
      });

      /**
       * 给翻页和条数增加父元素
 
var child = document.getElementById("child");//  获取子元素
var parent = document.createElement('parent');//  新建父元素
parent.className = 'parent';
child.parentNode.replaceChild(parent,child);//  获取子元素原来的父元素并将新父元素代替子元素
parent.appendChild(child);
       */
      /* TODO: 样式冲突
      $('.dt-length, .dt-paging').wrapAll('<div class="markerTable-bottom-right"></div>');
      */

    });

    return {
      props,
      tableContainerId,
      ifShowExplain,

    };
  },
  template: `
    <div class="module-content-box marker-table" style="display: flex;justify-content: space-evenly;width: 100%;">
    
      <div :id="tableContainerId" style="width: 1160px;"></div>
      
    </div>
  `
};
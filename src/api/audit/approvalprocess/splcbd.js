import fetch from 'utils/fetch';

export function add(query) {
  return fetch({
    url: '/api/workflow/spLcbd',
    method: 'post',
    data: query
  });
}

export function all() {
  return fetch({
    url: '/api/workflow/spLcbd/all',
    method: 'get'
  });
}

/**
 * 创建新模板，根据小类分组查询表单模板
 * @param xxdm
 */
export function bdxx(xxdm) {
  return fetch({
    url: '/api/workflow/spLcbd/bdxx/' + xxdm,
    method: 'get'
  });
}

/**
 * 复制表单，查询小类下的表单
 * @param params
 */
export function fzbd(params) {
  return fetch({
    url: '/api/workflow/spLcbd/fzbd',
    method: 'get',
    params
  });
}

export function page(params) {
  return fetch({
    url: '/api/workflow/spLcbd/page',
    method: 'get',
    params
  });
}

export function del(id) {
  return fetch({
    url: '/api/workflow/spLcbd/' + id,
    method: 'delete'
  });
}

export function get(id) {
  return fetch({
    url: '/api/workflow/spLcbd/' + id,
    method: 'get'
  });
}

export function put(id, query) {
  return fetch({
    url: '/api/workflow/spLcbd/' + id,
    method: 'put',
    data: query
  })
}

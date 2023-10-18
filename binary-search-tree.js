class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    const node = new Node(val)
    let currentNode = this.root
    if(!this.root){
      this.root = node;
      return this;
    }
    while(currentNode){
      if(val > currentNode.val){
        if(!currentNode.right){
          //val is greater than current and right node is null, insert right
          currentNode.right = node;
          return this;
          }
        //right node is not null and greater, move pointer
        currentNode = currentNode.right;
      }
      else if(val < currentNode.val){
        if(!currentNode.left){
          currentNode.left = node;
          return this
        }
        currentNode = currentNode.left;
      }
    }
    return this;
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {
    const newNode = new Node(val);
    if(!this.root) {
      this.root = newNode;
      return this;
    }

    function recursiveHelper(currentNode){
      if(!currentNode) return this
      if(newNode.val > currentNode.val){
        if(!currentNode.right){
          currentNode.right = newNode;
          return this;
        }
        
        return recursiveHelper(currentNode.right)
      }
      else if(newNode.val < currentNode.val){
        if(!currentNode.left){
          currentNode.left = newNode;
          return this;
        }
       
        return recursiveHelper(currentNode.left)
      }
    }

    recursiveHelper(this.root);
    return this;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let currentNode = this.root;
    while(currentNode){
      if(currentNode.val === val){
        return currentNode;
      }
      currentNode = (val > currentNode.val) ? currentNode.right : currentNode.left
    }
    return undefined;
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val) {

    function recursiveHelper(currentNode){
      if(!currentNode) return undefined;
      if(currentNode.val === val) return currentNode;
      return (val > currentNode.val) ? recursiveHelper(currentNode.right) : recursiveHelper(currentNode.left)
    }

    return recursiveHelper(this.root)
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    let arr = [];

    function traverse(currentNode){
      arr.push(currentNode.val);
      if(currentNode.left) traverse(currentNode.left);
      if(currentNode.right) traverse(currentNode.right);
    }
    traverse(this.root);
    return arr;
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    let arr = [];

    function traverse(currentNode){
      if(currentNode.left) traverse(currentNode.left);
      arr.push(currentNode.val);
      if(currentNode.right) traverse(currentNode.right);
    }

    traverse(this.root);
    return arr;
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    let arr = [];

    function traverse(currentNode){
      if(currentNode.left) traverse(currentNode.left);
      if(currentNode.right) traverse(currentNode.right);
      arr.push(currentNode.val);
    }

    traverse(this.root);
    return arr;
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    let result = [];
    let q = []
    if(this.root){
      q.push(this.root);

      while(q.length){
        const currentNode = q.shift();
        result.push(currentNode.val);

        if(currentNode.left){
          q.push(currentNode.left);
        }

        if(currentNode.right){
          q.push(currentNode.right)
        }
      }
    }
    return result
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {

    //helper function to change or remove reference to a node in the tree
    function removeReference(currentNode, target, ref){
      if(!currentNode) return
      if(currentNode.left === target){
        currentNode.left = ref;
        return
      }
      if(currentNode.right === target){
        currentNode.right = ref;
        return
      }
      return (target.val > currentNode.val) ? removeReference(currentNode.right, target, ref) : removeReference(currentNode.left, target, ref)
    }

    //select the node to remove
    let target = this.findRecursively(val)

    //if target has no children, remove reference to target
    if(!target.left && !target.right){
      removeReference(this.root, target, null);
      return target;
    }


    //if target has one child, copy child to target
    if((!target.left || !target.right) && (target.left || target.right)){
      if(target.left){
        //since we are mutating target node instead of removing it, return a copy
        let copy = {...target}
        target.val = target.left.val;
        target.left = null;
        return copy;
      }
      if(target.right){
        let copy = {...target}
        target.val = target.right.val;
        target.right = null;
        return copy;
      }
    }
    
    //if target has two children, find the next in order successor node
    //and copy that node to target
    //remove reference to successor

    //find in order successor of val
    const inorder = this.dfsInOrder()
    //since inorder is array of nodes in order, find node in array following target node
    const succVal = inorder[inorder.findIndex(n => n === val)+1]
    const successor = this.find(succVal)
    

    //if sucessor has children,  put child node vals in an array
    let successorChildren = []
    if(successor.right){  
      let currentNode = successor.right;
      while(currentNode){
        successorChildren.push(currentNode.val)
        currentNode = currentNode.right ? currentNode.right : currentNode.left
      }
    }
    console.log(successorChildren)

    //remove reference to successor
    removeReference(this.root, successor, null);

    //replace target with successor
    successor.left = target.left;
    successor.right = target.right;

    //if target is root, assign successor to root
    if(target === this.root){
      this.root = successor;
      return target
    }

    //if target is not root, point target parent at successor
    removeReference(this.root, target, successor)

    //re insert successor children into tree
    if(successorChildren.length){
      for(let child of successorChildren){
        this.insert(child)
      }
    }

    
    return target
  
  }

  removeEasyMode(val){
    //just return a new tree lol
    let nodeVals = this.dfsInOrder();
    let newTree = new BinarySearchTree();
    for(let nodeVal of nodeVals){
      if(nodeVal !== val) newTree.insert(nodeVal);
    }
    return newTree;
  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {

  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    if(!this.root) return undefined;
    const inorder = this.dfsInOrder();
    if(inorder.length > 1) return inorder[inorder.length-2];
    return undefined;
  }
}

module.exports = BinarySearchTree;

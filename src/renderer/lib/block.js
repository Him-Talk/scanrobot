class Block {
    /**
     * 构造函数
     * @param {Number} height
     * @param {String} previousHash
     * @param {Number} timestamp
     * @param {*} data
     * @param {String} hash
     */
    constructor(height, previousHash, timestamp, data, hash) {
        this.height = height
        this.previousHash = previousHash + ''
        this.timestamp = timestamp
        this.data = data
        this.hash = hash + ''
    }

    static generateBlock(blockData, previousBlock) {
        const nextHeight = previousBlock.height + 1;
        const nextTimeStamp = new Date().getTime();
        //暂时忽略MerkelRoot和Nonce
        const nextHash = CryptoJS.SHA256(nextHeight + previousBlock.hash + nextTimeStamp + blockData) + '';
        return new Block(nextHeight, previousBlock.hash, nextTimeStamp, blockData, nextHash);
    }
}
class BlockChain {

    /**
     * 如果指定在历史BlockChain上继续增加区块，则从本地存储中取出；否则默认创建新的区块链
     * @param { string } historyChain
     */
    constructor(historyChain) {
        this.blocks = [this.getGenesisBlock()]
    }

    // constructor(historyChain) {
    //   if( historyChain) {
    //     let blocks = this.getHistoryChain(historyChain);
    //     this.blocks = blocks ? [blocks] : [this.getGenesisBlock()];
    //   } else {
    //     this.blocks = [this.getGenesisBlock()]
    //   }
    // }

    /**
     * 将区块链异步保存到文件中
     */
    async saveHistoryChain(file, block) {
        await fs.appendFile(file, JSON.stringify(block), err => {
            if (err) throw err;
        console.log(`Height: ${block.height} is saved.`);
    });
    }

    /**
     * 从文件中同步读出历史区块数据
     */
    // getHistoryChain() {
    //   return fs.readFileSync('historyChain.txt', 'utf-8');
    // }

    /**
     * 创建区块链起源块, 此块是硬编码（取比特币高度:642022， 对应的时间是2020-08-03 17:00)
     */
    getGenesisBlock() {
        return new Block(0, '0', 1595490064640, 'GenesisBlock', '0000000000000000000d87bedef9550a014af9a3af74b791d84d049cc3ca85f4')
    }

    /**
     * 根据信息计算hash值
     */
    calcuteHash(height, previousHash, timestamp, data) {
        return CryptoJS.SHA256(height + previousHash + timestamp + data) + ''
    }

    /**
     * 得到区块链中最后一个块节点
     */
    getLatestBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    /**
     * 计算当前链表的下一个区块
     * @param {*} blockData
     */
    generateNextBlock(blockData) {
        const previousBlock = this.getLatestBlock()
        const nextIndex = previousBlock.height + 1
        const nextTimeStamp = new Date().getTime()
        const nextHash = this.calcuteHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData)
        return new Block(nextIndex, previousBlock.hash, nextTimeStamp, blockData, nextHash)
    }

    /**
     * 判断新加入的块是否合法
     * @param {Block} newBlock
     * @param {Block} previousBlock
     */
    isValidNewBlock(newBlock, previousBlock) {
        if(
            !(newBlock instanceof Block) ||
            !(previousBlock instanceof Block)
        ) {
            return false
        }

        // 判断height
        if(newBlock.height !== previousBlock.height + 1) {
            return false
        }

        // 判断hash值
        if(newBlock.previousHash !== previousBlock.hash) {
            return false
        }

        // 计算新块的hash值是否符合规则
        if(this.calcuteHash(newBlock.height, newBlock.previousHash, newBlock.timestamp, newBlock.data) !== newBlock.hash) {
            return false
        }

        return true
    }

    /**
     * 向区块链添加新节点
     * @param {Block} newBlock
     */
    addBlock(newBlock) {
        if(this.isValidNewBlock(newBlock, this.getLatestBlock())) {
            this.blocks.push(newBlock)
            return true
        }
        return false
    }

    /**
     * 判断新插入的区块链是否合法而且可以覆盖原来的节点
     * @param {Array} newChain
     */
    isValidNewChain(newChain) {
        if(Array.isArray(newChain) === false || newChain.length === 0) {
            return false
        }

        let newChainLength = newChain.length,
            firstBlock = newChain[0]

        // 硬编码的起源块不能改变
        if(firstBlock.height === 0) {
            return false
        }

        // 移植新的链的长度 <= 现有链的长度
        // 新的链不可信
        if(newChainLength + firstBlock.height <= this.blocks.length) {
            return false
        }

        // 下面检查新的链能否移植
        // 以及新的链的每个节点是否符合规则
        if(!this.isValidNewBlock(firstBlock, this.blocks[firstBlock.height - 1])) {
            return false
        }

        for(let i = 1; i < newChainLength; ++i) {
            if(!this.isValidNewBlock(newChain[i], newChain[i - 1])) {
                return false
            }
        }

        return true
    }

    /**
     * 插入新链表
     * @param {Array} newChain
     */
    addChain(newChain) {
        if(this.isValidNewChain(newChain)) {
            const height = newChain[0].height
            this.blocks.splice(height)
            this.blocks = this.blocks.concat(newChain)
            return true
        }
        return false
    }

    //打印该区块链的所有区块
    printBlockChain() {
        console.table(this.blocks);
    }

    //打印该区块链的最新区块
    printLastBlock() {
            console.table(this.blocks[this.blocks.length - 1]);
    }
}

//生成模拟的区块体交易数据
function generateBlockData() {
    const dataList = ['Zhangjie is cool', 'Pengxiaohua is cool', 'ChenZiqiang is cool', 'Fangguojun is cool', 'Lulina is beautiful', 'Maqicheng is cool', 'Wangchuanshuo is cool', 'Linshaoyuan is beautiful', 'Lulina is beautiful'];
    return dataList[Math.random() * dataList.length >> 0];
}

function mockBlocks() {
    //实例化一个区块链
    const blockChain = new BlockChain('testNet');

    blockChain.printLastBlock();

    let newBlock;
    setInterval(() => {
        newBlock = Block.generateBlock(generateBlockData(), blockChain.getLatestBlock());
    blockChain.addBlock(newBlock);
    blockChain.printBlockChain();
}, 2000);

}

//开启模拟区块
mockBlocks();
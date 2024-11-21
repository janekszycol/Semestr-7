<?php
/** @var $boxer ?\App\Model\Boxer */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="boxer[name]" value="<?= $boxer ? $boxer->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="weight">Weight</label>
    <input type="text" id="weight" name="boxer[weight]" value="<?= $boxer ? $boxer->getWeight() : '' ?>">
</div>

<div class="form-group">
    <label for="record">Record</label>
    <input type="text" id="record" name="boxer[record]" value="<?= $boxer ? $boxer->getRecord() : '' ?>">
</div>

<div class="form-group">
    <input type="submit" value="Submit">
</div>